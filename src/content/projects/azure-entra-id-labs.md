# Azure Labs Part 1: Entra ID Users, Groups, and Roles

I'm studying for the **Microsoft Azure Administrator (AZ-104)** certification. Alongside the course videos, I've been doing hands-on labs in my own Azure tenant so the concepts actually stick. This post covers my first set of labs, all focused on **Microsoft Entra ID** (formerly Azure Active Directory): creating users, building groups, delegating admin roles, inviting guests, and managing it all from PowerShell.

Everything in this lab ran on the **free tier** of Entra ID, so it cost $0.

---

## My Lab Setup

- **Azure tenant** on a pay-as-you-go subscription
- **A daily admin account** instead of my original sign-up account
- **PowerShell 7 and the Az module** installed on "devbox," a Debian 12 container in my Proxmox home lab that I reach through a browser-based VS Code (code-server)

### Why a separate daily admin account?

The account you sign up for Azure with becomes the most powerful account in the tenant: Global Administrator, subscription Owner, and billing owner. It's basically the "root" account. So I treated it like one: protected it with MFA and created a separate daily account with only what I need:

- **User Administrator** (an Entra role) so I can manage users and groups
- **Owner on my subscription** (an Azure RBAC role) so I can manage resources

This taught me the most important idea in this whole section: **Azure has two separate permission systems.**

| System | Controls | Example roles |
|---|---|---|
| Entra ID roles | The tenant: users, groups, licenses | Global Administrator, User Administrator |
| Azure RBAC roles | Resources: VMs, networks, storage | Owner, Contributor, Reader |

Being Owner of a subscription gives you zero power to create a user. Being User Administrator gives you zero power to create a VM.

### Installing PowerShell on Debian

PowerShell isn't in Debian's default package repositories, so I added Microsoft's repository first and then installed it with `apt`. Then I installed the Az module just for my user (no admin rights needed):

```powershell
Install-Module -Name Az -Repository PSGallery -Scope CurrentUser -Force
Connect-AzAccount -UseDeviceAuthentication
```

`-Scope CurrentUser` installs into my home folder, so it doesn't need sudo. Device authentication gives you a code to sign in from any browser, which is handy since devbox has no browser of its own.

---

## The Scenario

For all the labs, I played the new IT admin at a made-up company called **Wasatch Outfitters**, with users in Sales, IT, and HR.

---

## Lab 1: Creating Users by Hand

I created three users in the portal and filled in their **Department** field each time. That field matters later: groups and admin scoping can be based on it.

## Lab 2: Bulk Creating Users from a CSV

Entra lets you upload a CSV to create many users at once. My first upload failed, and the portal didn't make it obvious why.

**What I learned:**
- The real error lives in **Users > Bulk operation results**, where you can download a results file with an error for each row.
- My problem: I left the domain off the usernames. In the portal's single-user form, the domain is a dropdown, so I assumed it would fill in automatically. Bulk upload takes every value **literally**. It can't guess, because a tenant can have more than one domain.

**Takeaway:** an import tool does exactly what the file says, nothing more.

## Lab 3: Groups

I built a few groups:
- `SG-IT-Staff`: a security group with IT users added by hand
- `Wasatch-All`: a Microsoft 365 group
- `SG-All-Staff`: a security group with `SG-IT-Staff` **nested** inside it

**Gotcha #1: Nested membership doesn't show where you'd expect.** I expected Ben (an IT user) to show three groups on his profile, but only two appeared. A user's Groups page shows **direct** memberships. Ben is only in `SG-All-Staff` *through* `SG-IT-Staff`, which is called **transitive** membership.

**Gotcha #2: Not everything follows nesting.** Azure RBAC permissions do flow through nested groups. But **group-based licensing doesn't**, and Microsoft 365 groups can't contain other groups at all.

**Gotcha #3: Adding people by hand doesn't scale.** To build `SG-IT-Staff`, I had to look up who was in IT and add each person manually. That's the exact problem **dynamic groups** solve (a paid P1 feature): you write a rule like `(user.department -eq "IT")` and membership maintains itself.

That made me wonder if automatic membership is a security risk. The answer is yes, it moves the risk: whoever can edit the Department field controls the group. That's why companies use dynamic groups for broad, low-risk access, and manually assigned groups with approvals for sensitive access.

## Lab 4: Delegating Admin Roles

I gave Ben the **Helpdesk Administrator** role, then signed in as him to test password resets.

**First surprise:** my daily admin account couldn't assign the role. The button was grayed out. User Administrator can manage users, but **can't hand out admin roles**. If it could, a User Administrator could promote themselves. I had to use my Global Admin account for that one task, which is exactly how it should work.

**Results of Ben's password reset tests:**

| Ben tried to reset... | Result | Why |
|---|---|---|
| A regular user | ✅ Worked | Helpdesk Admins can reset regular users |
| My User Administrator account | ❌ Blocked | You can't reset someone more powerful than you |
| His own password (admin button) | ❌ Blocked | The admin reset tool skips identity checks, so it can't be used on yourself |

On the free tier, Helpdesk Administrator applies to the **whole tenant**. To limit it to one department, you'd use an **Administrative Unit**, which is the cloud version of delegating control on an OU in on-prem Active Directory (a P1 feature for the scoped admin).

## Lab 5: Inviting an External (Guest) User

I invited my personal email as a guest. Its username in my tenant came out looking like this:

```
myname_gmail.com#EXT#@<tenant>.onmicrosoft.com
```

- The `@` in the real email gets swapped for `_`
- `#EXT#` marks it as an external user
- My tenant's domain is added on the end

The tenant rewrites it because a username must end in a domain the tenant owns, and I don't own gmail.com. The guest never actually signs in with that name. They use their normal email and their own password, so my tenant never stores their credentials. That's the core idea of **B2B collaboration**.

## Lab 6: Managing Users with PowerShell

This is where I learned the most, mostly from errors.

**Finding parameters myself.** Instead of guessing, this shows every valid way to call a cmdlet:

```powershell
Get-Command New-AzADUser -Syntax
```

Reading the output:
- No brackets = **required** parameter
- `[-Param]` = optional
- `[-Param]` with no value type = a **switch** (on or off)
- `<string[]>` = accepts multiple values

**The `$` mistake.** I tried `-DisplayName $SG-IT-Staff` and got back nothing, with no error. In PowerShell, `$` means "variable," so it searched for a group name that didn't exist. Plain text needs quotes: `"SG-IT-Staff"`. Lesson: **empty output usually means "no match," not an error.**

**Creating, updating, and adding to a group:**

```powershell
New-AzADUser -DisplayName "Mark Powershell" -UserPrincipalName "markpowershell@<tenant>.onmicrosoft.com"
Update-AzADUser -UserPrincipalName "markpowershell@<tenant>.onmicrosoft.com" -Department "IT" -JobTitle "Help Desk"
Add-AzADGroupMember -MemberUserPrincipalName "markpowershell@<tenant>.onmicrosoft.com" -TargetGroupDisplayName "SG-IT-Staff"
Get-AzADGroupMember -GroupDisplayName "SG-IT-Staff"
```

I left off two required parameters when creating Mark, and PowerShell just **prompted me** for them. The password prompt was masked because `-Password` takes a SecureString, not plain text.

**The "blank doesn't mean empty" lesson.** After updating Mark, his Job Title showed up but his Department looked blank. The update didn't fail. Microsoft Graph only returns a default set of properties, and Department isn't one of them. Asking for it explicitly proved it was saved:

```powershell
Get-AzADUser -UserPrincipalName "markpowershell@<tenant>.onmicrosoft.com" -Select DisplayName,Department,JobTitle
```

**Objects, not text.** That output looked a little like JSON because of the `{}` blocks, but it's actually a PowerShell **object** being formatted for the screen. The pipe (`|`) passes whole objects between commands, which is why something like `| Select-Object DisplayName,Department` works so reliably. Behind the scenes, Microsoft Graph did send JSON, and the Az module converted it into objects for me.

## Cleanup

I used **Bulk delete** to remove my CSV users, then restored one from **Deleted users**. Deleted users can be restored for 30 days before they're permanently purged.

---

## Key Takeaways

1. **Two permission systems:** Entra roles control identities, Azure RBAC controls resources.
2. **Least privilege applies to you too:** my own daily account hit its limits, which is the point.
3. **Tools are literal:** bulk uploads and PowerShell do exactly what you tell them.
4. **Direct vs nested membership:** know what follows nesting (RBAC) and what doesn't (licensing).
5. **Blank output isn't always empty:** check what was actually returned before assuming something failed.
6. **Use `Get-Command -Syntax`** to figure out a cmdlet instead of guessing.

## What's Next

Next up is **Azure RBAC**: assigning roles on real resources like storage accounts, and why a "Reader" can see a storage account but sometimes can't read the files inside it.
