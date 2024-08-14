import { querySelector } from './util';
import { getAuthKeyAndId } from './me';
import { getUserUrl } from './user';

// woof, this is a lot. fortunately, most of it is fixed or just requires a user
// id, and doesn't need to be scraped.
export type EmporniumNavigation = {
  // personal data/stats

  // torrents im seeding
  seedingUrl: string;

  // torrents im leeching
  leechingUrl: string;

  // how i've used my tokens
  tokenHistoryUrl: string;

  // my bookmarks
  bookmarksUrl: string;

  // my requests
  myRequestsUrl: string;

  // my notifications (i think like when torrents are deleted or something)
  notificationsUrl: string;

  // my friends
  friendsUrl: string;

  // my donations
  myDonationsUrl: string;

  // my invites
  invitesUrl: string;

  // my uploads
  uploadsUrl: string;

  // messages

  // user-to-user messaging
  inboxUrl: string;

  // user-to-staff messaging
  staffInboxUrl: string;

  // forums/comments

  // my subscribed forum threads
  subscriptionsUrl: string;

  // forum posts i've made
  postHistoryUrl: string;

  // torrent comments i've made
  commentHistoryUrl: string;

  // the forum/comment post tester
  sandboxUrl: string;

  // account administration

  // kinda a general account overview
  userUrl: string;

  // adjust settings
  settingsUrl: string;

  // adjust security parameters
  securityUrl: string;

  // logout
  logoutToken: string;

  // site functions

  // all the tags
  tagsUrl: string;

  // all the requests
  requestsUrl: string;

  // all the collages
  collagesUrl: string;

  // the forums
  forumsUrl: string;

  // the irc web client
  chatUrl: string;

  // the top 10 torrents in various categories
  top10Url: string;

  // the rules
  rulesUrl: string;

  // the help article
  helpUrl: string;

  // create a new upload
  uploadUrl: string;

  // credits

  // the bonus shop where you can spend your bonus points
  bonusShopUrl: string;

  // the slot machine
  slotMachineUrl: string;
};

function getLogoutToken(document: Document): string {
  const logoutTokenElement = querySelector('#logout input[name="token"]', document);
  return logoutTokenElement?.getAttribute('value') || '';
}

export function getEmporiumNavigation(document: Document): EmporniumNavigation {
  const { id: userId } = getAuthKeyAndId(document);

  return {
    seedingUrl: `/torrents.php?type=seeding&userid=${userId}`,
    leechingUrl: `/torrents.php?type=leeching&userid=${userId}`,
    tokenHistoryUrl: '/userhistory.php?action=token_history',
    bookmarksUrl: `/bookmarks.php?type=torrents`,
    myRequestsUrl: '/requests.php?type=created',
    notificationsUrl: '/torrents.php?action=notify',
    friendsUrl: '/friends.php',
    myDonationsUrl: '/donate.php?action=my_donations',
    invitesUrl: `/user/${userId}/invite`,
    uploadsUrl: `/torrents.php?type=uploaded&userid=${userId}`,
    inboxUrl: '/user/inbox/received',
    staffInboxUrl: '/staffpm.php?action=user_inbox',
    subscriptionsUrl: '/userhistory.php?action=subscriptions',
    postHistoryUrl: '/userhistory.php?action=posts&group=0&showunread=0',
    commentHistoryUrl: '/userhistory.php?action=comments',
    sandboxUrl: '/sandbox',
    userUrl: getUserUrl(userId),
    settingsUrl: `/user.php?action=edit&userid=${userId}`,
    securityUrl: `/user/${userId}/security`,
    logoutToken: getLogoutToken(document),
    tagsUrl: '/tags.php',
    requestsUrl: '/requests.php',
    collagesUrl: '/collage',
    forumsUrl: '/forum',
    chatUrl: '/chat',
    top10Url: '/top10.php',
    rulesUrl: '/articles/view/rules',
    helpUrl: '/articles/view/tutorials',
    uploadUrl: '/upload.php',
    bonusShopUrl: '/bonus.php',
    slotMachineUrl: '/bonus.php?action=slot'
  };
}

export function getDefaultEmporniumNavigation(): EmporniumNavigation {
  return {
    seedingUrl: '',
    leechingUrl: '',
    tokenHistoryUrl: '',
    bookmarksUrl: '',
    myRequestsUrl: '',
    notificationsUrl: '',
    friendsUrl: '',
    myDonationsUrl: '',
    invitesUrl: '',
    uploadsUrl: '',
    inboxUrl: '',
    staffInboxUrl: '',
    subscriptionsUrl: '',
    postHistoryUrl: '',
    commentHistoryUrl: '',
    sandboxUrl: '',
    userUrl: '',
    settingsUrl: '',
    securityUrl: '',
    logoutToken: '',
    tagsUrl: '',
    requestsUrl: '',
    collagesUrl: '',
    forumsUrl: '',
    chatUrl: '',
    top10Url: '',
    rulesUrl: '',
    helpUrl: '',
    uploadUrl: '',
    bonusShopUrl: '',
    slotMachineUrl: ''
  };
}