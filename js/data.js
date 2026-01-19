/**
 * Mock Data for Hiver Omnichannel Prototype
 * Hiver Support scenarios: Email sync issues, shared inbox, performance
 */

const MockData = {
  // Customers - Hiver customers
  customers: {
    'cust-1': {
      id: 'cust-1',
      name: 'Nikki Sterling',
      email: 'nikki.s@ulstrucking.com',
      company: 'UL Strucking',
      tier: 'trial',
      avatar: 'NS',
      slackChannel: '#hiver-escalations',
      // Account Information
      account: {
        mrr: 0,
        arr: 0,
        healthScore: 72,
        healthTrend: 'down',
        contractStart: '2026-01-10',
        contractEnd: '2026-02-10',
        supportPlan: 'Trial',
        csm: 'Karun Kumar',
        totalTickets: 19,
        avgResolutionTime: '8.2 hours',
        npsScore: 45,
        lastActivity: '2026-01-19',
        products: ['Shared Inbox', 'Email Management'],
        seats: 12,
        smid: '307963',
        ug: '355349'
      }
    },
    'cust-2': {
      id: 'cust-2',
      name: 'Gunnar Petersen',
      email: 'gm@puevit.com',
      company: 'Puevit',
      tier: 'pro',
      avatar: 'GP',
      slackChannel: '#hiver-support',
      // Account Information
      account: {
        mrr: 450,
        arr: 5400,
        healthScore: 85,
        healthTrend: 'stable',
        contractStart: '2025-06-01',
        contractEnd: '2026-05-31',
        supportPlan: 'Business Hours',
        csm: 'Basit',
        totalTickets: 8,
        avgResolutionTime: '4.5 hours',
        npsScore: 68,
        lastActivity: '2026-01-19',
        products: ['Shared Inbox', 'Live Chat'],
        seats: 25
      }
    },
    'cust-3': {
      id: 'cust-3',
      name: 'Abhinav Sharma',
      email: 'abhinav@bayzat.com',
      company: 'Bayzat',
      tier: 'enterprise',
      avatar: 'AS',
      slackChannel: '#bayzat-vip',
      // Account Information
      account: {
        mrr: 2500,
        arr: 30000,
        healthScore: 91,
        healthTrend: 'up',
        contractStart: '2025-01-01',
        contractEnd: '2026-12-31',
        supportPlan: 'Premium 24/7',
        csm: 'Basit',
        totalTickets: 15,
        avgResolutionTime: '2.8 hours',
        npsScore: 82,
        lastActivity: '2026-01-19',
        products: ['Shared Inbox', 'Live Chat', 'Analytics'],
        seats: 150
      }
    },
    'cust-4': {
      id: 'cust-4',
      name: 'Leonardo Martinez',
      email: 'leonardo@techfirm.com',
      company: 'Tech Firm Inc',
      tier: 'pro',
      avatar: 'LM',
      slackChannel: null,
      // Account Information
      account: {
        mrr: 299,
        arr: 3588,
        healthScore: 78,
        healthTrend: 'stable',
        contractStart: '2025-09-15',
        contractEnd: '2026-09-14',
        supportPlan: 'Business Hours',
        csm: 'Harsha',
        totalTickets: 5,
        avgResolutionTime: '6.2 hours',
        npsScore: 62,
        lastActivity: '2026-01-18',
        products: ['Shared Inbox'],
        seats: 15
      }
    },
    'cust-5': {
      id: 'cust-5',
      name: 'George Williams',
      email: 'george@somersetcountyesc.org',
      company: 'Somerset County ESC',
      tier: 'pro',
      avatar: 'GW',
      slackChannel: null,
      // Account Information
      account: {
        mrr: 199,
        arr: 2388,
        healthScore: 88,
        healthTrend: 'up',
        contractStart: '2025-08-01',
        contractEnd: '2026-07-31',
        supportPlan: 'Business Hours',
        csm: 'Harsha',
        totalTickets: 3,
        avgResolutionTime: '5.1 hours',
        npsScore: 75,
        lastActivity: '2026-01-17',
        products: ['Shared Inbox', 'Email Templates'],
        seats: 8
      }
    }
  },

  // Tickets - Hiver support scenarios
  tickets: [
    {
      id: 'TKT-38495',
      customerId: 'cust-1',
      subject: 'Emails not loading until refresh | ulstrucking.com | Performance issue',
      preview: 'New emails are not automatically appearing in a custom view within a shared mailbox. Need to refresh the page frequently...',
      status: 'open',
      priority: 'urgent',
      tier: 1,
      channel: 'email',
      channels: ['email', 'slack', 'clickup'],
      createdAt: '2026-01-14T10:48:00Z',
      updatedAt: '2026-01-19T08:30:00Z',
      unread: true,
      tags: ['admirals', 'cart', 'views', 'performance'],
      linkedClickUp: '86d1jx5af',
      linkedSlack: true,
      assignee: 'agent-harsha',
      conversationId: '260105964',
      issueType: 'Views'
    },
    {
      id: 'TKT-38493',
      customerId: 'cust-3',
      subject: 'Chat transcript not syncing to email thread',
      preview: 'When a live chat ends, the transcript is not being appended to the original email conversation...',
      status: 'open',
      priority: 'high',
      tier: 1,
      channel: 'chat',
      channels: ['chat', 'email'],
      createdAt: '2026-01-18T13:15:00Z',
      updatedAt: '2026-01-19T09:45:00Z',
      unread: true,
      tags: ['l1-chat', 'managed', 'transcript'],
      linkedClickUp: null,
      linkedSlack: false,
      assignee: 'agent-basit'
    },
    {
      id: 'TKT-38490',
      customerId: 'cust-2',
      subject: 'Gmail History Fetch Stuck for User',
      preview: 'One of our team members cannot see emails older than last week. Gmail history fetch seems to be stuck...',
      status: 'waiting',
      priority: 'high',
      tier: 2,
      channel: 'email',
      channels: ['email', 'clickup'],
      createdAt: '2026-01-17T08:00:00Z',
      updatedAt: '2026-01-18T14:30:00Z',
      unread: false,
      tags: ['gmail', 'fetch', 'sync', 'l2-bug'],
      linkedClickUp: '86d1kx7bg',
      linkedSlack: false,
      assignee: 'agent-basit'
    },
    {
      id: 'TKT-38488',
      customerId: 'cust-4',
      subject: 'Chat widget not appearing on website',
      preview: 'We installed the Hiver chat widget code but it is not showing up on our website. Checked console for errors...',
      status: 'open',
      priority: 'medium',
      tier: 0,
      channel: 'chat',
      channels: ['chat'],
      createdAt: '2026-01-19T07:30:00Z',
      updatedAt: '2026-01-19T07:30:00Z',
      unread: true,
      tags: ['chat-widget', 'installation', 'how-to'],
      linkedClickUp: null,
      linkedSlack: false,
      assignee: 'agent-harsha'
    },
    {
      id: 'TKT-38485',
      customerId: 'cust-5',
      subject: 'Automation rule not triggering for specific tag',
      preview: 'We set up an automation to assign emails with "urgent" tag to a specific team member but it is not working...',
      status: 'open',
      priority: 'medium',
      tier: 0,
      channel: 'email',
      channels: ['email'],
      createdAt: '2026-01-18T15:00:00Z',
      updatedAt: '2026-01-18T15:00:00Z',
      unread: false,
      tags: ['automation', 'rules', 'tags'],
      linkedClickUp: null,
      linkedSlack: false,
      assignee: 'agent-harsha'
    }
  ],

  // Conversation timelines - Hiver support discussions
  timelines: {
    'TKT-38495': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Nikki Sterling',
        timestamp: '2026-01-14T10:48:00Z',
        content: `Hi Hiver Support,

We're experiencing a frustrating issue where new emails are not automatically appearing in a custom view within our shared mailbox. Our team needs to manually refresh the page frequently to see incoming emails.

This is affecting all users on our Hiver account (12 people). The issue started about 3 days ago.

Details:
- Affected user: nikki.s@ulstrucking.com
- Account: csrteam@ulstrucking.com (SMID: 307963)
- All users on the account are experiencing the same behavior

This is impacting our response times significantly as we're a trucking logistics company and need to respond to customer inquiries quickly.

Can you please look into this urgently?

Thanks,
Nikki Sterling
Customer Service Lead, UL Strucking`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Harsha G',
        timestamp: '2026-01-14T11:15:00Z',
        content: `Hi Nikki,

Thank you for reaching out and for the detailed information. I understand how critical timely email visibility is for your logistics operations.

I'm looking into this issue for you. A few clarifying questions:

1. Is this happening in all shared mailbox views or just specific custom views?
2. Are you using the Hiver Chrome extension or the web app?
3. Have there been any recent changes to your Gmail settings or browser?

In the meantime, I'm escalating this to our L1 technical team for deeper investigation.

Best regards,
Harsha G
Hiver Support (L0)`
      },
      {
        id: 'msg-3',
        type: 'system',
        channel: 'system',
        timestamp: '2026-01-14T11:20:00Z',
        content: 'Ticket escalated to L1 (Technical Support)'
      },
      {
        id: 'msg-4',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Nikki Sterling',
        timestamp: '2026-01-14T14:30:00Z',
        content: `Hi Harsha,

Thanks for the quick response! To answer your questions:

1. It's happening specifically in our custom views (we have views filtered by tags like "urgent", "shipping", "billing"). The Primary inbox seems to load faster.
2. We're using the Hiver Chrome extension (latest version)
3. No recent changes that I'm aware of

Also, I recorded a short video showing the issue - you can see a 15-20 second delay before new emails appear in the custom view.

Video link: https://www.loom.com/share/ulstrucking-hiver-delay

Looking forward to your findings.

Thanks,
Nikki`
      },
      {
        id: 'msg-5',
        type: 'message',
        channel: 'slack',
        sender: 'agent',
        senderName: 'Harsha G',
        timestamp: '2026-01-15T09:00:00Z',
        content: `@Shankar @Akash Sinha - Need your input on this ulstrucking.com case. Customer is experiencing delayed email loading in custom views. They shared a video showing 15-20 second delays.

Key details:
- Trial customer (12 seats)
- SMID: 307963
- Issue affects all users on the account
- Custom views specifically affected, Primary inbox loads faster

The customer has a call scheduled today at 12 PM PST to discuss. Can we prioritize investigating this?`,
        isSlackThread: true
      },
      {
        id: 'msg-6',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Akash Sinha',
        timestamp: '2026-01-15T09:15:00Z',
        content: `@Harsha G Thanks for flagging. I'll take a look at the backend logs for this account. The custom view delay pattern typically indicates one of two things:
1. High volume of conversations in the filtered view
2. Complex filter conditions causing slow query execution

Let me pull up their account metrics and get back to you before the call.`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-7',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Shankar',
        timestamp: '2026-01-15T09:30:00Z',
        content: `@Harsha G Good escalation. This is a trial customer - we should prioritize this as it could impact conversion.

@Jagatdeep @Sushil - FYI, this might be related to the views performance issue we discussed last sprint. Can you check if this account falls into the affected cohort?`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-8',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Jagatdeep',
        timestamp: '2026-01-15T10:00:00Z',
        content: `@Shankar Looking at the account now. They have 8 custom views with fairly complex filter conditions. The "Shipping" view alone has 4500+ conversations which is contributing to the slow load times.

This is expected behavior for high-volume custom views. We have an optimization planned for Q1 that should address this.

@Sushil - thoughts on providing any interim workaround?`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-9',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Sushil',
        timestamp: '2026-01-15T10:30:00Z',
        content: `@Jagatdeep For now, we can suggest:
1. Breaking down large views into smaller, date-bounded views
2. Using simpler filter conditions where possible
3. Archiving old conversations to reduce view size

These are workarounds until the optimization ships. @Harsha G - can you communicate this to the customer during the call?`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-10',
        type: 'system',
        channel: 'clickup',
        timestamp: '2026-01-15T11:00:00Z',
        content: 'ClickUp task 86d1jx5af created: "Emails not loading until refresh | ulstrucking.com | Trial | Active"',
        clickUpStatus: 'Open'
      },
      {
        id: 'msg-11',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Aishwarya Uppal',
        timestamp: '2026-01-16T02:03:00Z',
        content: `Hey Nikki,

Thank you so much for sharing the video with me - I completely understand how even minor delays can impact your day-to-day workflow.

That being said, from a technical standpoint, this behaviour is expected and aligns with how Gmail and Hiver function together. Your Primary inbox loads almost instantly because it is rendered natively by Gmail and typically contains a relatively smaller dataset for now.

The shared inbox, on the other hand, is linked to the Hiver extension and is currently holding a much higher volume of conversations. When you access it, Hiver fetches and overlays additional metadata on top of Gmail's data via Gmail APIs - including assignment, tags, automation context, and the activity panel.

This additional API processing and UI rendering can result in a short delay of a few seconds, particularly for high-traffic shared inboxes. This delay does not indicate a performance issue or degradation but is a byproduct of the additional data being queried and rendered at the time the shared inbox is loaded.

Since your network speed is much more stable now, I'd request you to keep an eye out for any consistent or extended delays beyond what you're currently experiencing.

Best regards,
Aishwarya Uppal
Hiver Support`
      },
      {
        id: 'msg-12',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Nikki Sterling',
        timestamp: '2026-01-16T12:44:00Z',
        content: `Hi Aishwarya,

Good morning! Thanks for the explanation.

I think it would be best to set up a call so your team can identify the root causes of these issues. Can we please schedule a meeting for Monday 1/19 at 12:00 PM PST?

Here's the Support ticket link: https://v2.hiverhq.com/permalinks/pvt/1ed34558

Google Meet joining info:
Video call link: https://meet.google.com/xxx-xxxx-xxx

Thank you!
Nikki`
      },
      {
        id: 'msg-13',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Saumya Rastogi',
        timestamp: '2026-01-19T07:45:00Z',
        content: `any response here @Harsha G?`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-14',
        type: 'message',
        channel: 'slack',
        sender: 'agent',
        senderName: 'Harsha G',
        timestamp: '2026-01-19T08:00:00Z',
        content: `@Saumya Rastogi The customer has scheduled a call at 12 PM PST. Checking with engineers to see if we can accommodate this request or re-schedule.`,
        isSlackThread: true
      },
      {
        id: 'msg-15',
        type: 'message',
        channel: 'slack',
        sender: 'agent',
        senderName: 'Harsha G',
        timestamp: '2026-01-19T08:30:00Z',
        content: `Rescheduling the call due to unavailability.`,
        isSlackThread: true
      }
    ],
    'TKT-38493': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'Abhinav Sharma',
        timestamp: '2026-01-18T13:15:00Z',
        content: `Hi! We're having an issue with chat transcripts not syncing to email threads. When a live chat ends, the transcript should be appended to the original email conversation but it's not happening.`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'chat',
        sender: 'agent',
        senderName: 'Basit',
        timestamp: '2026-01-18T13:18:00Z',
        content: `Hi Abhinav! Thanks for reaching out. I understand this is affecting your workflow.

Can you confirm:
1. Is this happening for all chats or specific ones?
2. Are the chats initiated from email threads or standalone?
3. What browser are you using?`
      },
      {
        id: 'msg-3',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'Abhinav Sharma',
        timestamp: '2026-01-18T13:22:00Z',
        content: `1. It's happening for all chats that originate from email threads
2. They're initiated from email threads - customer clicks chat from an existing email
3. Chrome latest version

We noticed this started happening after we updated some automation rules last week.`
      },
      {
        id: 'msg-4',
        type: 'message',
        channel: 'chat',
        sender: 'agent',
        senderName: 'Basit',
        timestamp: '2026-01-18T13:25:00Z',
        content: `Got it! The automation rule change is a good lead. Let me check your account settings and the automation configuration.

I'll also loop in our L1 team to investigate the sync logic. Can you share a specific conversation ID where this happened so we can trace it?`
      },
      {
        id: 'msg-5',
        type: 'system',
        channel: 'system',
        timestamp: '2026-01-18T13:30:00Z',
        content: 'Conversation converted from Chat to Email for async follow-up'
      },
      {
        id: 'msg-6',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Abhinav Sharma',
        timestamp: '2026-01-19T09:45:00Z',
        content: `Hi Basit,

Here are 3 conversation IDs where the transcript didn't sync:
- Conv ID: 259847123
- Conv ID: 259852456
- Conv ID: 259861789

All three had active email threads before the chat was initiated. Let me know what you find!

Thanks,
Abhinav`
      }
    ],
    'TKT-38490': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Gunnar Petersen',
        timestamp: '2026-01-17T08:00:00Z',
        content: `Hello Hiver Support,

One of our team members (sarah@puevit.com) cannot see emails older than last week in their Hiver view. When she checks Gmail directly, all emails are there, but Hiver only shows recent ones.

We tried:
- Logging out and back in
- Clearing browser cache
- Reinstalling the Chrome extension

Nothing worked. Please help!

Best,
Gunnar`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Basit',
        timestamp: '2026-01-17T08:45:00Z',
        content: `Hi Gunnar,

Thank you for the detailed troubleshooting steps you've already taken.

This sounds like a Gmail history fetch issue. When a user connects to Hiver, we sync their Gmail history. Sometimes this process can get stuck.

I'm escalating this to our L1 technical team to check the sync status for sarah@puevit.com and manually trigger a re-sync if needed.

I'll update you within 24 hours.

Best regards,
Basit
Hiver Support`
      },
      {
        id: 'msg-3',
        type: 'system',
        channel: 'system',
        timestamp: '2026-01-17T09:00:00Z',
        content: 'Ticket escalated to L1 (Technical Support)'
      },
      {
        id: 'msg-4',
        type: 'system',
        channel: 'clickup',
        timestamp: '2026-01-17T09:30:00Z',
        content: 'ClickUp task 86d1kx7bg created: "Gmail History Fetch Stuck - sarah@puevit.com"',
        clickUpStatus: 'In Progress'
      },
      {
        id: 'msg-5',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Basit',
        timestamp: '2026-01-18T14:30:00Z',
        content: `Hi Gunnar,

Update from our L1 team: We identified that the Gmail history fetch for sarah@puevit.com was indeed stuck at 85% completion. Our engineering team has manually triggered a re-sync.

The sync should complete within the next 2-4 hours. Please ask Sarah to check after that and confirm if she can see older emails.

We're also investigating why this happened to prevent future occurrences.

Best regards,
Basit`
      }
    ],
    'TKT-38488': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'Leonardo Martinez',
        timestamp: '2026-01-19T07:30:00Z',
        content: `Hi! We just installed the Hiver chat widget on our website but it's not showing up. We followed the installation guide and added the code snippet to our website's header.`
      }
    ],
    'TKT-38485': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'George Williams',
        timestamp: '2026-01-18T15:00:00Z',
        content: `Hi Hiver Team,

We set up an automation rule to assign any email with the "urgent" tag to our team lead (john@somersetcountyesc.org), but it's not working.

Rule details:
- Trigger: When tag "urgent" is added
- Action: Assign to john@somersetcountyesc.org

We've tested by manually adding the tag, but the assignment doesn't happen automatically.

Can you help us troubleshoot?

Thanks,
George Williams
Somerset County ESC`
      }
    ]
  },

  // Knowledge Base Articles - Hiver-specific
  kbArticles: [
    {
      id: 'kb-1',
      title: 'Troubleshooting Slow Shared Inbox Loading',
      category: 'Performance',
      lastUpdated: '2026-01-10',
      relevance: 95,
      views: 3450
    },
    {
      id: 'kb-2',
      title: 'Custom Views Best Practices',
      category: 'Views',
      lastUpdated: '2026-01-05',
      relevance: 92,
      views: 2890
    },
    {
      id: 'kb-3',
      title: 'Gmail History Sync Issues - Troubleshooting Guide',
      category: 'Sync',
      lastUpdated: '2026-01-12',
      relevance: 98,
      views: 4100
    },
    {
      id: 'kb-4',
      title: 'Chat Widget Installation Guide',
      category: 'Live Chat',
      lastUpdated: '2025-12-20',
      relevance: 90,
      views: 2756
    },
    {
      id: 'kb-5',
      title: 'Automation Rules Setup & Troubleshooting',
      category: 'Automation',
      lastUpdated: '2025-12-15',
      relevance: 88,
      views: 2200
    },
    {
      id: 'kb-6',
      title: 'Chat Transcript Sync to Email Threads',
      category: 'Live Chat',
      lastUpdated: '2026-01-08',
      relevance: 85,
      views: 1945
    },
    {
      id: 'kb-7',
      title: 'Optimizing Shared Inbox for High Volume',
      category: 'Performance',
      lastUpdated: '2026-01-14',
      relevance: 94,
      views: 1678
    },
    {
      id: 'kb-8',
      title: 'Understanding Hiver Chrome Extension',
      category: 'Getting Started',
      lastUpdated: '2026-01-11',
      relevance: 86,
      views: 5200
    }
  ],

  // ClickUp Issues - Hiver engineering (with full details)
  clickUpIssues: {
    '86d1jx5af': {
      key: '86d1jx5af',
      summary: 'Emails not loading until refresh | ulstrucking.com | Trial | Active',
      description: `Customer experiencing delayed email loading in custom views.

**Account Details:**
- Chat Transcript link: v2.hiverhq.com/permalinks/pvt/1ed34558
- Email link: v2.hiverhq.com/permalinks/pvt/1ebfe56d
- Affected user: nikki.s@ulstrucking.com
- Affected Name/SMID: csrteam@ulstrucking.com / 307963
- Affected UG: 355349

**Issue description:**
The customer has reported an issue where new emails are not automatically appearing in a custom view within a shared mailbox. She needs to refresh the page frequently to see incoming emails. She also mentioned that all users on the Hiver account are experiencing the same behavior.

**Investigation:**
- 8 custom views with complex filter conditions
- "Shipping" view has 4500+ conversations
- Expected behavior for high-volume views, optimization planned for Q1`,
      status: 'Open',
      priority: 'Urgent',
      type: 'Bug',
      assignee: 'Admirals',
      reporter: 'Harsha G',
      created: '2026-01-15T11:00:00Z',
      updated: '2026-01-19T08:30:00Z',
      linkedTicket: 'TKT-38495',
      labels: ['admirals', 'cart', 'views', 'performance', 'trial'],
      comments: [
        {
          id: 'cc-1',
          author: 'Karun Kumar',
          timestamp: '2026-01-16T09:45:00Z',
          content: 'Changed status from Open to Waiting On Cx Response'
        },
        {
          id: 'cc-2',
          author: 'Karun Kumar',
          timestamp: '2026-01-16T09:45:00Z',
          content: 'Added task to Admirals Sprint 1 (1/6 - 1/19)'
        },
        {
          id: 'cc-3',
          author: 'Saumya Rastogi',
          timestamp: '2026-01-19T07:45:00Z',
          content: 'any response here @Harsha G?'
        },
        {
          id: 'cc-4',
          author: 'Harsha G',
          timestamp: '2026-01-19T08:00:00Z',
          content: '@Saumya Rastogi The customer has scheduled a call at 12 PM PST. Checking with engineers to see if we can accommodate this request or re-schedule.'
        },
        {
          id: 'cc-5',
          author: 'Harsha G',
          timestamp: '2026-01-19T08:30:00Z',
          content: 'Rescheduling the call due to unavailability.'
        }
      ]
    },
    '86d1kx7bg': {
      key: '86d1kx7bg',
      summary: 'Gmail History Fetch Stuck - sarah@puevit.com',
      description: `User cannot see emails older than last week in Hiver view.

**Account Details:**
- User: sarah@puevit.com
- Company: Puevit

**Issue:**
Gmail history fetch stuck at 85% completion. Manual re-sync triggered.

**Root Cause:**
Investigating why the sync process stalled.`,
      status: 'In Progress',
      priority: 'High',
      type: 'Bug',
      assignee: 'Backend Team',
      reporter: 'Basit',
      created: '2026-01-17T09:30:00Z',
      updated: '2026-01-18T14:30:00Z',
      linkedTicket: 'TKT-38490',
      labels: ['sync', 'gmail', 'fetch', 'l1-escalation'],
      comments: [
        {
          id: 'cc-1',
          author: 'Basit',
          timestamp: '2026-01-17T09:30:00Z',
          content: 'Created from support ticket TKT-38490. User reported missing historical emails.'
        },
        {
          id: 'cc-2',
          author: 'Tech Team',
          timestamp: '2026-01-18T10:00:00Z',
          content: 'Identified sync stuck at 85%. Triggering manual re-sync.'
        },
        {
          id: 'cc-3',
          author: 'Tech Team',
          timestamp: '2026-01-18T14:30:00Z',
          content: 'Re-sync initiated. Should complete in 2-4 hours. Monitoring.'
        }
      ]
    }
  },

  // ClickUp workflow statuses
  clickUpStatuses: ['Open', 'In Progress', 'In Review', 'Waiting On Cx Response', 'Resolved', 'Closed'],

  // ClickUp priorities
  clickUpPriorities: ['Urgent', 'High', 'Medium', 'Low']
};

// Export for use in other modules
window.MockData = MockData;
