/**
 * Mock Data for Hiver Omnichannel Prototype
 * Cyara-specific scenarios: IVR testing, chatbot validation, voice quality
 */

const MockData = {
  // Customers - Enterprise companies using Cyara
  customers: {
    'cust-1': {
      id: 'cust-1',
      name: 'Rachel Morrison',
      email: 'rachel.morrison@unitedhealth.com',
      company: 'UnitedHealth Group',
      tier: 'enterprise',
      avatar: 'RM',
      slackChannel: '#unitedhealth-support',
      // Account Information
      account: {
        mrr: 125000,
        arr: 1500000,
        healthScore: 92,
        healthTrend: 'up',
        contractStart: '2023-03-15',
        contractEnd: '2026-03-14',
        supportPlan: 'Premium 24/7',
        csm: 'Sarah Johnson',
        totalTickets: 47,
        avgResolutionTime: '4.2 hours',
        npsScore: 72,
        lastActivity: '2025-01-16',
        products: ['Pulse', 'Cruncher', 'Velocity', 'ResolveAI'],
        seats: 250
      }
    },
    'cust-2': {
      id: 'cust-2',
      name: 'James Chen',
      email: 'james.chen@capitalone.com',
      company: 'Capital One',
      tier: 'enterprise',
      avatar: 'JC',
      slackChannel: '#capitalone-vip',
      // Account Information
      account: {
        mrr: 95000,
        arr: 1140000,
        healthScore: 88,
        healthTrend: 'stable',
        contractStart: '2022-08-01',
        contractEnd: '2025-07-31',
        supportPlan: 'Premium 24/7',
        csm: 'Michael Brown',
        totalTickets: 32,
        avgResolutionTime: '3.8 hours',
        npsScore: 68,
        lastActivity: '2025-01-16',
        products: ['Pulse', 'Velocity'],
        seats: 180
      }
    },
    'cust-3': {
      id: 'cust-3',
      name: 'Amanda Foster',
      email: 'amanda.foster@verizon.com',
      company: 'Verizon Communications',
      tier: 'enterprise',
      avatar: 'AF',
      slackChannel: '#verizon-cx-team',
      // Account Information
      account: {
        mrr: 185000,
        arr: 2220000,
        healthScore: 78,
        healthTrend: 'down',
        contractStart: '2023-06-01',
        contractEnd: '2025-05-31',
        supportPlan: 'Premium 24/7',
        csm: 'Sarah Johnson',
        totalTickets: 89,
        avgResolutionTime: '6.1 hours',
        npsScore: 54,
        lastActivity: '2025-01-16',
        products: ['Pulse', 'Cruncher', 'Velocity', 'ResolveAI'],
        seats: 450
      }
    },
    'cust-4': {
      id: 'cust-4',
      name: 'David Kumar',
      email: 'david.kumar@nationwide.com',
      company: 'Nationwide Insurance',
      tier: 'pro',
      avatar: 'DK',
      slackChannel: null,
      // Account Information
      account: {
        mrr: 28000,
        arr: 336000,
        healthScore: 85,
        healthTrend: 'up',
        contractStart: '2024-01-15',
        contractEnd: '2026-01-14',
        supportPlan: 'Business Hours',
        csm: 'Emily Davis',
        totalTickets: 12,
        avgResolutionTime: '8.5 hours',
        npsScore: 65,
        lastActivity: '2025-01-16',
        products: ['Velocity'],
        seats: 50
      }
    },
    'cust-5': {
      id: 'cust-5',
      name: 'Michelle Torres',
      email: 'michelle.t@regional-bank.com',
      company: 'Regional Bank Corp',
      tier: 'pro',
      avatar: 'MT',
      slackChannel: null,
      // Account Information
      account: {
        mrr: 15000,
        arr: 180000,
        healthScore: 91,
        healthTrend: 'stable',
        contractStart: '2024-06-01',
        contractEnd: '2025-05-31',
        supportPlan: 'Business Hours',
        csm: 'Emily Davis',
        totalTickets: 8,
        avgResolutionTime: '5.2 hours',
        npsScore: 78,
        lastActivity: '2025-01-16',
        products: ['ResolveAI'],
        seats: 25
      }
    }
  },

  // Tickets - Cyara-specific support scenarios
  tickets: [
    {
      id: 'TKT-2847',
      customerId: 'cust-1',
      subject: 'IVR test suite failing after Genesys Cloud migration',
      preview: 'Our automated IVR tests for the claims hotline are returning "no audio detected" errors after migrating to Genesys Cloud...',
      status: 'open',
      priority: 'high',
      tier: 2,
      channel: 'email',
      channels: ['email', 'slack', 'jira'],
      createdAt: '2025-01-16T09:30:00Z',
      updatedAt: '2025-01-16T14:22:00Z',
      unread: true,
      tags: ['ivr', 'genesys', 'audio-detection', 'migration'],
      linkedJira: 'ENG-4521',
      linkedSlack: true,
      assignee: 'agent-mike'
    },
    {
      id: 'TKT-2848',
      customerId: 'cust-2',
      subject: 'Pulse bot testing - how to validate NLU intents?',
      preview: 'We need guidance on setting up intent validation for our new virtual assistant. The bot responses are inconsistent...',
      status: 'open',
      priority: 'medium',
      tier: 1,
      channel: 'chat',
      channels: ['chat', 'email'],
      createdAt: '2025-01-16T11:15:00Z',
      updatedAt: '2025-01-16T13:45:00Z',
      unread: true,
      tags: ['chatbot', 'pulse', 'nlu', 'how-to'],
      linkedJira: null,
      linkedSlack: false,
      assignee: 'agent-mike'
    },
    {
      id: 'TKT-2849',
      customerId: 'cust-3',
      subject: 'Voice quality degradation in Cruncher load tests',
      preview: 'Running 500 concurrent call tests and seeing MOS scores drop below 3.5 after 200 calls. Need help identifying bottleneck...',
      status: 'waiting',
      priority: 'high',
      tier: 3,
      channel: 'phone',
      channels: ['phone', 'email', 'slack', 'jira'],
      createdAt: '2025-01-15T16:00:00Z',
      updatedAt: '2025-01-16T10:30:00Z',
      unread: false,
      tags: ['cruncher', 'load-testing', 'voice-quality', 'mos'],
      linkedJira: 'ENG-4518',
      linkedSlack: true,
      assignee: 'agent-mike'
    },
    {
      id: 'TKT-2850',
      customerId: 'cust-4',
      subject: 'Velocity scheduled tests not triggering',
      preview: 'Set up hourly IVR monitoring via Velocity but tests havent run in 3 days. Dashboard shows "scheduled" but no executions...',
      status: 'open',
      priority: 'medium',
      tier: 1,
      channel: 'email',
      channels: ['email'],
      createdAt: '2025-01-16T08:00:00Z',
      updatedAt: '2025-01-16T08:00:00Z',
      unread: true,
      tags: ['velocity', 'scheduling', 'monitoring'],
      linkedJira: null,
      linkedSlack: false,
      assignee: 'agent-mike'
    },
    {
      id: 'TKT-2851',
      customerId: 'cust-5',
      subject: 'ResolveAI transcription accuracy issues',
      preview: 'Agent desktop showing incorrect transcriptions for Spanish language calls. Affects our bilingual support quality metrics...',
      status: 'open',
      priority: 'medium',
      tier: 2,
      channel: 'chat',
      channels: ['chat', 'email'],
      createdAt: '2025-01-16T07:30:00Z',
      updatedAt: '2025-01-16T09:15:00Z',
      unread: false,
      tags: ['resolveai', 'transcription', 'spanish', 'accuracy'],
      linkedJira: null,
      linkedSlack: false,
      assignee: 'agent-mike'
    }
  ],

  // Conversation timelines - Cyara product-specific discussions
  timelines: {
    'TKT-2847': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Rachel Morrison',
        timestamp: '2025-01-16T09:30:00Z',
        content: `Hi Cyara Support,

We completed our migration from Avaya to Genesys Cloud last weekend, and now our entire IVR test suite is failing.

Error: "No audio detected within timeout period (30s)"

This affects all 47 test cases in our Claims Hotline journey. The same tests worked perfectly before migration. We've verified:
- SIP trunk connectivity is fine (manual calls work)
- Audio files play correctly in Genesys
- Cyara agent endpoints are reachable

Our go-live for the new system is in 5 days. This is critical for us.

Best regards,
Rachel Morrison
CX Quality Lead, UnitedHealth Group`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T09:45:00Z',
        content: `Hi Rachel,

Thank you for the detailed information. I understand the urgency with your go-live timeline.

The "no audio detected" error after a CCaaS migration typically points to one of these causes:
1. Codec mismatch between Genesys and Cyara
2. RTP port range changes
3. NAT/firewall rules blocking media streams

Can you confirm:
1. Which codecs are configured in your Genesys trunk? (G.711 μ-law, G.729, etc.)
2. Are you using Cyara Cloud or on-premise agents?
3. Any firewall changes made during migration?

I'm escalating this to Tier 2 for deeper technical investigation.

Best,
Mike
Cyara Support`
      },
      {
        id: 'msg-3',
        type: 'system',
        channel: 'system',
        timestamp: '2025-01-16T10:00:00Z',
        content: 'Ticket escalated to Tier 2 (Technical Investigation - Networking)'
      },
      {
        id: 'msg-4',
        type: 'message',
        channel: 'slack',
        sender: 'customer',
        senderName: 'Rachel Morrison',
        timestamp: '2025-01-16T10:15:00Z',
        content: `Hey Mike - quick Slack update. Our network team just confirmed they changed the RTP port range to 16384-32767 for Genesys. The old Avaya range was 10000-20000. Could that be causing the issue with Cyara agents?`,
        isSlackThread: true
      },
      {
        id: 'msg-5',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Senior Engineer (Tom)',
        timestamp: '2025-01-16T10:25:00Z',
        content: `@mike That's likely the issue. Their Cyara agent config probably still has the old port range. I'll check their tenant settings.`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-6',
        type: 'system',
        channel: 'jira',
        timestamp: '2025-01-16T10:30:00Z',
        content: 'Jira issue ENG-4521 created: "UnitedHealth - RTP port mismatch after Genesys migration"',
        jiraStatus: 'In Progress'
      },
      {
        id: 'msg-7',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T11:00:00Z',
        content: `Hi Rachel,

Excellent catch on the RTP ports! Your Slack message about the port range change was exactly what we needed.

Our engineering team confirmed that your Cyara agent configuration was still using the Avaya port range (10000-20000). We've updated it to match Genesys (16384-32767).

Can you re-run a few test cases from your Claims Hotline suite and confirm if audio detection is working now?

I've also created engineering ticket ENG-4521 to track this and ensure we document the fix for future migrations.

Best,
Mike`
      },
      {
        id: 'msg-8',
        type: 'message',
        channel: 'slack',
        sender: 'customer',
        senderName: 'Rachel Morrison',
        timestamp: '2025-01-16T14:22:00Z',
        content: `Tests are passing now! 🎉 All 47 test cases green. You just saved our go-live. Thank you!!`,
        isSlackThread: true
      },
      {
        id: 'msg-9',
        type: 'system',
        channel: 'jira',
        timestamp: '2025-01-16T14:22:00Z',
        content: 'Jira ENG-4521 updated: Resolution confirmed - RTP port configuration updated',
        jiraStatus: 'Ready for Testing'
      }
    ],
    'TKT-2848': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'James Chen',
        timestamp: '2025-01-16T11:15:00Z',
        content: `Hi! We're rolling out a new virtual assistant for account balance inquiries and need help with Pulse testing. How do we validate that the bot correctly identifies customer intents?`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'chat',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T11:18:00Z',
        content: `Hi James! Great question. Pulse supports NLU intent validation through our Bot Response Assertions feature.

You can define expected intents and confidence thresholds for each test utterance. Would you like me to walk you through the setup?`
      },
      {
        id: 'msg-3',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'James Chen',
        timestamp: '2025-01-16T11:20:00Z',
        content: `Yes please! Also, this is going to be a detailed walkthrough - can we switch to email? I need to loop in our bot development team.`
      },
      {
        id: 'msg-4',
        type: 'system',
        channel: 'system',
        timestamp: '2025-01-16T11:21:00Z',
        content: 'Conversation converted from Chat to Email for async follow-up'
      },
      {
        id: 'msg-5',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T13:45:00Z',
        content: `Hi James,

As discussed in our chat, here's a detailed guide for validating NLU intents with Pulse:

**Setting Up Intent Validation:**

1. Navigate to Pulse > Test Cases > Bot Responses
2. For each test utterance, add an "Intent Assertion":
   - Expected Intent: e.g., "CheckBalance"
   - Confidence Threshold: Recommended 0.85 or higher
   - Fallback Handling: Define behavior for low-confidence matches

3. Configure Entity Extraction validation:
   - Account Type: "checking" / "savings"
   - Date Range: if applicable

4. Set up Conversation Flow assertions:
   - Expected bot responses for each intent
   - Timeout thresholds for bot response time

**Sample Test Case Structure:**
\`\`\`
Utterance: "What's my checking account balance?"
Expected Intent: CheckBalance (confidence >= 0.85)
Expected Entities: {accountType: "checking"}
Expected Response Contains: "Your balance is"
\`\`\`

I've attached our KB article "Bot Testing Best Practices with Pulse" which includes more examples.

Feel free to share with your bot development team and let me know if you have questions!

Best,
Mike`
      }
    ],
    'TKT-2849': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'phone',
        sender: 'customer',
        senderName: 'Amanda Foster',
        timestamp: '2025-01-15T16:00:00Z',
        content: `[Phone Call Summary]
Duration: 18 minutes
Customer: Amanda Foster, Director of CX Engineering, Verizon

Issue: Voice quality degradation during Cruncher load tests
Details:
- Running 500 concurrent call load tests
- MOS scores dropping to 3.2-3.4 after ~200 concurrent calls
- Target MOS is 4.0+ for production certification
- Tests running against their Cisco UCCE platform
- Using Cyara Cloud agents (US-East region)

Urgency: Production certification deadline in 2 weeks. Cannot certify without passing load tests.`
      },
      {
        id: 'msg-2',
        type: 'system',
        channel: 'system',
        timestamp: '2025-01-15T16:15:00Z',
        content: 'Ticket escalated to Tier 2 (Technical Investigation)'
      },
      {
        id: 'msg-3',
        type: 'message',
        channel: 'email',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-15T16:30:00Z',
        content: `Hi Amanda,

Following up on our call about the MOS score degradation during load tests.

To investigate the bottleneck, I need:
1. Cruncher test execution logs from a recent failed run
2. Your Cisco UCCE capacity specs (concurrent call limit)
3. Network topology between Cyara agents and your UCCE cluster
4. Time-series graph of MOS scores during the test (if available)

Is the degradation:
a) Gradual (slowly decreases as calls increase)?
b) Sudden (drops sharply at a specific call count)?
c) Oscillating (varies throughout the test)?

This will help us identify whether it's a Cyara-side, network, or platform limitation.

Best,
Mike`
      },
      {
        id: 'msg-4',
        type: 'message',
        channel: 'slack',
        sender: 'customer',
        senderName: 'Amanda Foster',
        timestamp: '2025-01-15T17:00:00Z',
        content: `Mike - just pulled the data. The MOS drop is sudden, happens right around 200-210 concurrent calls every time. Attached the execution logs to the email.

Also, I should mention we upgraded our UCCE cluster last month from 4 to 8 nodes. Could there be a config issue with the new nodes?`,
        isSlackThread: true
      },
      {
        id: 'msg-5',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'CS Manager (Sarah)',
        timestamp: '2025-01-15T17:15:00Z',
        content: `@mike FYI Verizon is in our top 5 accounts. Their renewal is Q2 and load testing certification is a key success metric for them. Let's make sure we get the right resources on this.`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-6',
        type: 'system',
        channel: 'system',
        timestamp: '2025-01-15T17:30:00Z',
        content: 'Ticket escalated to Tier 3 (Management/Complex Escalation)'
      },
      {
        id: 'msg-7',
        type: 'system',
        channel: 'jira',
        timestamp: '2025-01-16T09:00:00Z',
        content: 'Jira issue ENG-4518 created: "Verizon - Cruncher MOS degradation at 200+ concurrent calls"',
        jiraStatus: 'In Progress'
      },
      {
        id: 'msg-8',
        type: 'message',
        channel: 'slack',
        sender: 'internal',
        senderName: 'Cloud Ops (Kevin)',
        timestamp: '2025-01-16T10:30:00Z',
        content: `@mike Found something interesting. The sudden drop at 200 calls aligns with when traffic starts routing to their new UCCE nodes. Looking at packet captures, seems like the new nodes have different QoS markings. Investigating further.`,
        isSlackThread: true,
        isInternal: true
      },
      {
        id: 'msg-9',
        type: 'system',
        channel: 'jira',
        timestamp: '2025-01-16T10:30:00Z',
        content: 'Jira ENG-4518 updated: Investigating QoS marking discrepancy on new UCCE nodes',
        jiraStatus: 'In Progress'
      }
    ],
    'TKT-2850': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'David Kumar',
        timestamp: '2025-01-16T08:00:00Z',
        content: `Hi Cyara Support,

I set up automated IVR monitoring using Velocity 3 days ago. The schedule is configured for hourly execution against our Claims IVR, but I haven't seen any test runs.

Dashboard shows:
- Schedule Status: Active
- Next Run: Always shows a time in the past
- Last Execution: Never

I've verified:
- Test case runs fine manually
- Schedule is enabled
- Time zone is set correctly (EST)

Is there something I'm missing in the configuration?

Thanks,
David Kumar
QA Manager, Nationwide Insurance`
      }
    ],
    'TKT-2851': [
      {
        id: 'msg-1',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'Michelle Torres',
        timestamp: '2025-01-16T07:30:00Z',
        content: `Hi! We're seeing issues with ResolveAI transcription accuracy for Spanish language calls. The agent desktop shows incorrect transcriptions about 30% of the time, affecting our bilingual support QA scores.`
      },
      {
        id: 'msg-2',
        type: 'message',
        channel: 'chat',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T07:35:00Z',
        content: `Hi Michelle! Sorry to hear about the transcription issues. A 30% error rate is definitely higher than expected.

A few questions to help diagnose:
1. Is this happening with all Spanish dialects or specific ones (Mexican, Castilian, etc.)?
2. Are the errors mostly in specific words/phrases or random?
3. Are you using the standard Spanish model or a custom-trained one?`
      },
      {
        id: 'msg-3',
        type: 'message',
        channel: 'chat',
        sender: 'customer',
        senderName: 'Michelle Torres',
        timestamp: '2025-01-16T07:38:00Z',
        content: `Good questions! It's primarily Mexican Spanish speakers (our main customer base). Errors seem to cluster around financial terms - "transferencia", "saldo", "cuenta de ahorros". We're using the standard model.`
      },
      {
        id: 'msg-4',
        type: 'message',
        channel: 'chat',
        sender: 'agent',
        senderName: 'Agent Mike',
        timestamp: '2025-01-16T07:42:00Z',
        content: `That's very helpful! The pattern with financial terms suggests the standard model may need domain-specific tuning for banking vocabulary.

I'd recommend:
1. Custom vocabulary list for financial terms
2. Potentially a fine-tuned model for banking Spanish

Let me escalate to our AI team - they can review sample transcriptions and recommend the best approach. Can you share 5-10 example call recordings where transcription failed?`
      },
      {
        id: 'msg-5',
        type: 'system',
        channel: 'system',
        timestamp: '2025-01-16T07:45:00Z',
        content: 'Ticket escalated to Tier 2 (AI/ML Team)'
      },
      {
        id: 'msg-6',
        type: 'message',
        channel: 'email',
        sender: 'customer',
        senderName: 'Michelle Torres',
        timestamp: '2025-01-16T09:15:00Z',
        content: `Hi Mike,

Thanks for the quick response on chat! I've uploaded 10 sample recordings to the secure file share you mentioned:
- 5 with incorrect transcriptions (highlighted the errors)
- 5 that transcribed correctly (for comparison)

All are Mexican Spanish, banking context. Let me know what the AI team recommends!

Michelle`
      }
    ]
  },

  // Knowledge Base Articles - Cyara-specific
  kbArticles: [
    {
      id: 'kb-1',
      title: 'Troubleshooting IVR Audio Detection Failures',
      category: 'IVR Testing',
      lastUpdated: '2025-01-10',
      relevance: 95,
      views: 2450
    },
    {
      id: 'kb-2',
      title: 'Genesys Cloud Integration Guide',
      category: 'Integrations',
      lastUpdated: '2025-01-05',
      relevance: 88,
      views: 1890
    },
    {
      id: 'kb-3',
      title: 'Bot Testing Best Practices with Pulse',
      category: 'Chatbot Testing',
      lastUpdated: '2025-01-12',
      relevance: 98,
      views: 3100
    },
    {
      id: 'kb-4',
      title: 'Understanding MOS Scores in Cruncher',
      category: 'Load Testing',
      lastUpdated: '2024-12-20',
      relevance: 92,
      views: 1756,
      stale: true
    },
    {
      id: 'kb-5',
      title: 'Velocity Scheduling Configuration',
      category: 'Monitoring',
      lastUpdated: '2024-11-15',
      relevance: 90,
      views: 1200,
      stale: true
    },
    {
      id: 'kb-6',
      title: 'ResolveAI Custom Vocabulary Setup',
      category: 'AI/Transcription',
      lastUpdated: '2025-01-08',
      relevance: 85,
      views: 945
    },
    {
      id: 'kb-7',
      title: 'RTP Port Configuration for CCaaS Migrations',
      category: 'Networking',
      lastUpdated: '2025-01-14',
      relevance: 94,
      views: 678
    },
    {
      id: 'kb-8',
      title: 'NLU Intent Validation in Pulse',
      category: 'Chatbot Testing',
      lastUpdated: '2025-01-11',
      relevance: 96,
      views: 2200
    }
  ],

  // Jira Issues - Cyara engineering (with full details)
  jiraIssues: {
    'ENG-4521': {
      key: 'ENG-4521',
      summary: 'UnitedHealth - RTP port mismatch after Genesys migration',
      description: `Customer experiencing "no audio detected" errors after migrating from Avaya to Genesys Cloud.

**Root Cause:** RTP port range mismatch
- Genesys config: 16384-32767
- Cyara agent config: 10000-20000 (old Avaya range)

**Resolution:** Updated Cyara agent RTP port configuration to match new Genesys range.`,
      status: 'Ready for Testing',
      priority: 'High',
      type: 'Bug',
      assignee: 'Cloud Ops Team',
      reporter: 'Agent Mike',
      created: '2025-01-16T10:30:00Z',
      updated: '2025-01-16T14:22:00Z',
      linkedTicket: 'TKT-2847',
      labels: ['migration', 'genesys', 'rtp', 'audio'],
      comments: [
        {
          id: 'jc-1',
          author: 'Agent Mike',
          timestamp: '2025-01-16T10:30:00Z',
          content: 'Created from support ticket TKT-2847. Customer has go-live in 5 days - urgent.'
        },
        {
          id: 'jc-2',
          author: 'Tom (Senior Engineer)',
          timestamp: '2025-01-16T10:45:00Z',
          content: 'Confirmed RTP port mismatch. Customer Slack thread mentioned they changed ports during migration. Updating agent config now.'
        },
        {
          id: 'jc-3',
          author: 'Tom (Senior Engineer)',
          timestamp: '2025-01-16T11:15:00Z',
          content: 'Config updated. Pushed to production. Customer should re-test.'
        },
        {
          id: 'jc-4',
          author: 'Agent Mike',
          timestamp: '2025-01-16T14:22:00Z',
          content: 'Customer confirmed all 47 test cases passing. Moving to Ready for Testing for QA verification.'
        }
      ]
    },
    'ENG-4518': {
      key: 'ENG-4518',
      summary: 'Verizon - Cruncher MOS degradation at 200+ concurrent calls',
      description: `Customer running 500 concurrent call load tests. MOS scores drop below 3.5 after ~200 calls.

**Environment:**
- Platform: Cisco UCCE (recently upgraded from 4 to 8 nodes)
- Cyara: Cloud agents, US-East region
- Target MOS: 4.0+

**Investigation:**
- MOS drop is sudden at 200-210 calls
- Correlates with traffic routing to new UCCE nodes
- Possible QoS marking discrepancy on new nodes`,
      status: 'In Progress',
      priority: 'Critical',
      type: 'Bug',
      assignee: 'Platform Team',
      reporter: 'Agent Mike',
      created: '2025-01-16T09:00:00Z',
      updated: '2025-01-16T10:30:00Z',
      linkedTicket: 'TKT-2849',
      labels: ['cruncher', 'voice-quality', 'mos', 'load-testing', 'cisco'],
      comments: [
        {
          id: 'jc-1',
          author: 'Agent Mike',
          timestamp: '2025-01-16T09:00:00Z',
          content: 'Escalated from Tier 3. Verizon is a top 5 account with Q2 renewal. Production certification deadline in 2 weeks.'
        },
        {
          id: 'jc-2',
          author: 'Kevin (Cloud Ops)',
          timestamp: '2025-01-16T09:45:00Z',
          content: 'Analyzing packet captures. Noticed call routing pattern changes at the 200 call threshold.'
        },
        {
          id: 'jc-3',
          author: 'Kevin (Cloud Ops)',
          timestamp: '2025-01-16T10:30:00Z',
          content: 'Found it - the new UCCE nodes have different QoS/DSCP markings than the original 4 nodes. This causes degradation when load balancer routes to new nodes. Need customer to verify their QoS config on new nodes.'
        }
      ]
    }
  },

  // Jira workflow statuses
  jiraStatuses: ['Open', 'In Progress', 'In Review', 'Ready for Testing', 'Resolved', 'Closed'],

  // Jira priorities
  jiraPriorities: ['Critical', 'High', 'Medium', 'Low']
};

// Export for use in other modules
window.MockData = MockData;
