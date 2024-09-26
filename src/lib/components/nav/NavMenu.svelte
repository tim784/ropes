<script lang="ts">
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import Button from '$components/ui/Button.svelte';
  import House from 'lucide-svelte/icons/house';
  import Briefcase from 'lucide-svelte/icons/briefcase';
  import CircleUser from 'lucide-svelte/icons/circle-user';
  import MessageSquareText from 'lucide-svelte/icons/message-square-text';
  import Coins from 'lucide-svelte/icons/coins';
  import LifeBuoy from 'lucide-svelte/icons/life-buoy';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Inbox from 'lucide-svelte/icons/inbox';
  import FileUp from 'lucide-svelte/icons/file-up';
  import { settings } from '$stores/settings';
  import { type BaseDataStore } from '$stores/page';
  import { getContext } from 'svelte';

  const baseDataStore = getContext<BaseDataStore>('baseDataStore');

  $: nav = $baseDataStore.navigation;

  $: t = $settings.openNonRopesInNewTab ? { target: '_blank' } : {};
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost">Navigation</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>

      <!-- General -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <House class="mr-2 h-4 w-4" />
          <span>Site General</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.homeUrl} {...t}>Home</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.tagsUrl} {...t}>Tags</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.requestsUrl} {...t}>Requests</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.collagesUrl} {...t}>Collages</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.chatUrl} {...t}>Chat</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.top10Url} {...t}>Top 10</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- your stuff -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <Briefcase class="mr-2 h-4 w-4" />
          <span>Your Stuff</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.seedingUrl} {...t}>Your Seeds</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.leechingUrl} {...t}>Your Leeches</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.uploadUrl} {...t}>Your Uploads</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.tokenHistoryUrl} {...t}>Your Tokens</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.bookmarksUrl} {...t}>Your Bookmarks</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.myRequestsUrl} {...t}>Your Requests</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.notificationsUrl} {...t}
            >Your Notifications</DropdownMenu.Item
          >
          <DropdownMenu.Item href={nav.friendsUrl} {...t}>Your Friends</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.myDonationsUrl} {...t}>Your Donations</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.invitesUrl} {...t}>Your Invites</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- messages -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <Inbox class="mr-2 h-4 w-4" />
          <span>Messages</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.inboxUrl} {...t}>Inbox</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.staffInboxUrl} {...t}>Staff Inbox</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- Account -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <CircleUser class="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.userUrl} {...t}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.settingsUrl} {...t}>Settings</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.securityUrl} {...t}>Security</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- Forums -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <MessageSquareText class="mr-2 h-4 w-4" />
          <span>Forum</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.forumsUrl} {...t}>Forum</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.subscriptionsUrl} {...t}>Subscriptions</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.postHistoryUrl} {...t}>Post History</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.commentHistoryUrl} {...t}>Comment History</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.sandboxUrl} {...t}>Sandbox</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- Help -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <LifeBuoy class="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.helpUrl} {...t}>Help Article</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.rulesUrl} {...t}>Rules Article</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <!-- Help -->
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <Coins class="mr-2 h-4 w-4" />
          <span>Credits</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent class="min-w-max">
          <DropdownMenu.Item href={nav.bonusShopUrl} {...t}>Bonus Shop</DropdownMenu.Item>
          <DropdownMenu.Item href={nav.slotMachineUrl} {...t}>Slot Machine</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Group>

    <DropdownMenu.Separator />

    <DropdownMenu.Item href={nav.uploadUrl} {...t}>
      <div class="flex"><FileUp class="mr-2 h-4 w-4" />Upload</div>
    </DropdownMenu.Item>

    <DropdownMenu.Separator />

    <form method="post" action="/logout">
      <input type="hidden" name="token" value={nav.logoutToken} />
      <DropdownMenu.Item asChild let:builder>
        <!-- sorry about all the classes, this is a copy-paste
        dropdown-menu-item because we really need this to be a button, which
        shadcn-svelte nor bits-ui support.-->
        <button
          use:builder.action
          {...builder}
          type="submit"
          class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
        >
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </button>
      </DropdownMenu.Item>
    </form>
  </DropdownMenu.Content>
</DropdownMenu.Root>
