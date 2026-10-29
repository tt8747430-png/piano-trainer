// The app's Privacy and Terms (ADR 0116): what is kept, where, for how long, and the rules of the Public library.
// Plain words, a section a heading and its paragraph; the date is when either last changed.
export const legal = {
  updated: 'Last changed {{date}}',
  privacy: {
    title: 'Privacy',
    sections: {
      device: {
        heading: 'On your device',
        text: 'Without an account, everything you do stays on this device: your settings, progress, songs, recordings of your playing and the lessons you’ve read. Nothing is sent anywhere. Clearing the browser’s data for the app removes it.',
      },
      account: {
        heading: 'With an account',
        text: 'An account is optional. It keeps your email address, the name you give, and your password (stored only as a hash by the sign-in service). Signing in with Google gives us your email address and name from Google, nothing else.',
      },
      sync: {
        heading: 'What syncs',
        text: 'While you’re signed in, your settings, progress, songs and versions, patterns, takes (the notes you played, not audio), library and the views you left are copied to your account so they reach your other devices. Only you can read them.',
      },
      public: {
        heading: 'What you publish',
        text: 'A song you publish to the Public library is seen by anyone, with the name you give as its author. You can take it out at any time. Reports of a song are read by the app’s editors.',
      },
      errors: {
        heading: 'When something goes wrong',
        text: 'If a screen fails, the app sends what went wrong: the error, the screen’s address, the app’s version and your browser’s name, and your account if you’re signed in. It is read only to fix the app.',
      },
      where: {
        heading: 'Where it is kept',
        text: 'Accounts and synced data are kept by Supabase in the European Union (Ireland). The app is served by Vercel. There is no advertising, no tracking and no selling of data.',
      },
      delete: {
        heading: 'Taking it with you, and deleting it',
        text: 'Settings › Sync and data saves a backup of everything to a file. Settings › Account deletes your account: it is removed for good after 30 days, and signing in before then lets you keep it.',
      },
    },
  },
  terms: {
    title: 'Terms',
    sections: {
      use: {
        heading: 'Using the app',
        text: 'Piano Trainer is free to use for learning and practising music. It comes as it is, without a promise that it will always be available or free of mistakes.',
      },
      account: {
        heading: 'Your account',
        text: 'Keep your password to yourself. You’re responsible for what is done with your account. An account that breaks these terms may be stopped from publishing, or closed.',
      },
      publish: {
        heading: 'What you publish',
        text: 'Publish only music you wrote, or may share. You keep the rights to it; publishing lets anyone play it and save a copy of it in the app. Songs that break someone’s rights, or are offensive, are taken out.',
      },
      content: {
        heading: 'The app’s own content',
        text: 'The lessons, songs and exercises that come with the app are for your own learning. The songs are public domain or arranged for the app.',
      },
      changes: {
        heading: 'Changes',
        text: 'These terms may change as the app does. The date above says when they last did.',
      },
    },
  },
} as const
