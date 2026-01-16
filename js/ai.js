/**
 * AI Module for Hiver Omnichannel Prototype
 * Simulates AI-powered features for support automation
 */

const AI = {
  // Simulated processing delay for realistic feel
  processingDelay: 800,

  /**
   * Initialize AI module
   */
  init() {
    console.log('AI Module initialized');
  },

  // ============================================
  // 1. SMART REPLY SUGGESTIONS
  // ============================================

  /**
   * Generate smart reply suggestions based on conversation context
   */
  async generateReplySuggestions(ticket, timeline) {
    await this.simulateDelay();

    const lastCustomerMessage = this.getLastCustomerMessage(timeline);
    const context = this.analyzeContext(ticket, timeline);

    // Find relevant KB articles
    const relevantKB = this.findRelevantKBArticles(ticket, lastCustomerMessage);

    // Generate suggestions based on context
    const suggestions = this.buildReplySuggestions(ticket, context, relevantKB, lastCustomerMessage);

    return {
      suggestions,
      relevantKB,
      confidence: Math.floor(Math.random() * 15) + 85 // 85-99%
    };
  },

  /**
   * Build reply suggestions based on context
   */
  buildReplySuggestions(ticket, context, relevantKB, lastMessage) {
    const suggestions = [];

    // Suggestion templates based on ticket type and context
    if (context.isHowTo) {
      suggestions.push({
        id: 'sug-1',
        type: 'how-to',
        title: 'Step-by-step guidance',
        preview: `Here's how to ${context.topic}...`,
        content: this.generateHowToResponse(ticket, relevantKB),
        kbReference: relevantKB[0]
      });
    }

    if (context.isTechnicalIssue) {
      suggestions.push({
        id: 'sug-2',
        type: 'troubleshooting',
        title: 'Troubleshooting steps',
        preview: 'Let me help diagnose this issue...',
        content: this.generateTroubleshootingResponse(ticket, context),
        kbReference: relevantKB[0]
      });
    }

    if (context.needsEscalation) {
      suggestions.push({
        id: 'sug-3',
        type: 'escalation',
        title: 'Escalation response',
        preview: 'I\'m escalating this to our specialist team...',
        content: this.generateEscalationResponse(ticket, context)
      });
    }

    // Always add a follow-up question suggestion
    suggestions.push({
      id: 'sug-4',
      type: 'clarification',
      title: 'Request more details',
      preview: 'To help resolve this faster...',
      content: this.generateClarificationResponse(ticket, context)
    });

    return suggestions.slice(0, 3); // Return top 3
  },

  generateHowToResponse(ticket, relevantKB) {
    const kbTitle = relevantKB[0]?.title || 'our documentation';
    return `Hi,

Thank you for reaching out! I'd be happy to help you with this.

Based on your question, here's a step-by-step guide:

1. Navigate to the relevant section in your Cyara dashboard
2. Follow the configuration steps outlined in "${kbTitle}"
3. Test the changes in a staging environment first
4. Deploy to production once verified

I've attached the relevant documentation for your reference. Please let me know if you need any clarification on these steps.

Best regards`;
  },

  generateTroubleshootingResponse(ticket, context) {
    return `Hi,

Thank you for the detailed information. I understand this is impacting your ${context.topic || 'workflow'}.

Based on the symptoms you've described, I'd like to gather a few more details:

1. When did this issue first occur?
2. Were there any recent changes to your environment?
3. Can you share any error logs or screenshots?

In the meantime, here are some initial troubleshooting steps:
- Verify your configuration settings
- Check network connectivity
- Review recent deployment changes

I'll investigate this further and get back to you with a solution.

Best regards`;
  },

  generateEscalationResponse(ticket, context) {
    return `Hi,

Thank you for your patience. Based on my investigation, this issue requires deeper technical analysis.

I'm escalating this to our Tier ${context.suggestedTier || 2} team who specialize in ${context.topic || 'these types of issues'}. They will:

1. Review the technical details
2. Analyze system logs
3. Provide a root cause analysis

You can expect an update within the next 2-4 hours. I'll remain on this ticket to ensure continuity.

Best regards`;
  },

  generateClarificationResponse(ticket, context) {
    return `Hi,

Thank you for contacting Cyara Support. To help resolve this as quickly as possible, could you please provide:

1. Your Cyara platform version
2. The specific steps to reproduce the issue
3. Any error messages you're seeing
4. Your environment details (Cloud/On-premise)

This information will help us diagnose the issue faster.

Best regards`;
  },

  // ============================================
  // 2. AUTO-TRIAGE & ROUTING
  // ============================================

  /**
   * Automatically triage a ticket - suggest tier, priority, tags
   */
  async autoTriage(subject, content, customerTier) {
    await this.simulateDelay();

    const text = `${subject} ${content}`.toLowerCase();

    // Determine suggested tier
    let suggestedTier = 1;
    let tierReason = 'Standard process inquiry';

    if (this.containsAny(text, ['error', 'failing', 'broken', 'not working', 'crash', 'timeout', 'degradation'])) {
      suggestedTier = 2;
      tierReason = 'Technical issue requiring investigation';
    }

    if (this.containsAny(text, ['critical', 'urgent', 'production down', 'major outage', 'blocking'])) {
      suggestedTier = 3;
      tierReason = 'Critical issue requiring immediate attention';
    }

    if (customerTier === 'enterprise' && suggestedTier < 2) {
      suggestedTier = 2;
      tierReason = 'Enterprise customer - elevated handling';
    }

    // Determine priority
    let suggestedPriority = 'medium';
    let priorityReason = 'Standard priority based on content';

    if (this.containsAny(text, ['urgent', 'asap', 'critical', 'production', 'go-live', 'deadline'])) {
      suggestedPriority = 'high';
      priorityReason = 'Urgent language detected';
    }

    if (this.containsAny(text, ['when you get a chance', 'no rush', 'question about', 'curious'])) {
      suggestedPriority = 'low';
      priorityReason = 'Non-urgent inquiry';
    }

    // Suggest tags
    const suggestedTags = this.extractTags(text);

    // Determine category
    const category = this.determineCategory(text);

    return {
      tier: {
        value: suggestedTier,
        reason: tierReason,
        confidence: Math.floor(Math.random() * 10) + 88
      },
      priority: {
        value: suggestedPriority,
        reason: priorityReason,
        confidence: Math.floor(Math.random() * 10) + 85
      },
      tags: suggestedTags,
      category: category,
      suggestedAssignee: this.suggestAssignee(suggestedTier, category)
    };
  },

  extractTags(text) {
    const tagPatterns = {
      'ivr': ['ivr', 'interactive voice', 'phone tree', 'dtmf'],
      'chatbot': ['chatbot', 'bot', 'pulse', 'virtual assistant', 'nlu'],
      'voice-quality': ['mos', 'voice quality', 'audio', 'call quality', 'jitter'],
      'load-testing': ['cruncher', 'load test', 'concurrent', 'performance', 'stress test'],
      'monitoring': ['velocity', 'scheduled', 'monitoring', 'alerting'],
      'migration': ['migration', 'migrate', 'genesys', 'avaya', 'cisco'],
      'api': ['api', 'integration', 'webhook', 'rest'],
      'authentication': ['login', 'password', 'sso', 'authentication', 'access'],
      'transcription': ['transcription', 'speech-to-text', 'resolveai', 'accuracy']
    };

    const foundTags = [];
    for (const [tag, keywords] of Object.entries(tagPatterns)) {
      if (keywords.some(kw => text.includes(kw))) {
        foundTags.push(tag);
      }
    }

    return foundTags.slice(0, 4);
  },

  determineCategory(text) {
    if (this.containsAny(text, ['how to', 'how do i', 'can i', 'help with', 'guide', 'documentation'])) {
      return { name: 'How-To', icon: '📖' };
    }
    if (this.containsAny(text, ['error', 'bug', 'broken', 'not working', 'failing', 'issue'])) {
      return { name: 'Bug Report', icon: '🐛' };
    }
    if (this.containsAny(text, ['feature', 'request', 'would be nice', 'suggestion', 'enhance'])) {
      return { name: 'Feature Request', icon: '💡' };
    }
    if (this.containsAny(text, ['slow', 'performance', 'timeout', 'latency', 'degradation'])) {
      return { name: 'Performance', icon: '⚡' };
    }
    return { name: 'General Inquiry', icon: '💬' };
  },

  suggestAssignee(tier, category) {
    const assignees = {
      1: ['Agent Mike', 'Agent Sarah', 'Agent Tom'],
      2: ['Senior Engineer Tom', 'Tech Lead Rachel', 'Platform Specialist Kevin'],
      3: ['Engineering Manager', 'Support Director', 'Cloud Ops Lead']
    };
    const pool = assignees[tier] || assignees[1];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  // ============================================
  // 3. CONVERSATION SUMMARY
  // ============================================

  /**
   * Generate a summary of the conversation for escalations
   */
  async generateSummary(ticket, timeline) {
    await this.simulateDelay();

    const customer = MockData.customers[ticket.customerId];
    const messageCount = timeline.filter(t => t.type === 'message').length;
    const channels = [...new Set(timeline.map(t => t.channel))];

    // Extract key points
    const keyPoints = this.extractKeyPoints(timeline);
    const currentStatus = this.determineCurrentStatus(ticket, timeline);
    const nextSteps = this.suggestNextSteps(ticket, timeline);

    return {
      overview: {
        customer: customer?.name,
        company: customer?.company,
        customerTier: customer?.tier,
        ticketAge: this.calculateTicketAge(ticket.createdAt),
        messageCount,
        channelsUsed: channels
      },
      problem: keyPoints.problem,
      investigation: keyPoints.investigation,
      currentStatus,
      keyFindings: keyPoints.findings,
      nextSteps,
      generatedAt: new Date().toISOString()
    };
  },

  extractKeyPoints(timeline) {
    const messages = timeline.filter(t => t.type === 'message');
    const customerMessages = messages.filter(m => m.sender === 'customer');
    const agentMessages = messages.filter(m => m.sender === 'agent');

    // Simple extraction - in real AI this would be NLP
    const firstCustomerMsg = customerMessages[0]?.content || '';
    const problem = firstCustomerMsg.split('\n').slice(0, 3).join(' ').substring(0, 200);

    const findings = [];
    messages.forEach(msg => {
      if (msg.content.toLowerCase().includes('found') ||
          msg.content.toLowerCase().includes('confirmed') ||
          msg.content.toLowerCase().includes('root cause')) {
        findings.push(msg.content.substring(0, 100));
      }
    });

    return {
      problem: problem || 'Issue details pending',
      investigation: agentMessages.length > 0 ? 'Agent has responded and is investigating' : 'Awaiting initial response',
      findings: findings.slice(0, 3)
    };
  },

  determineCurrentStatus(ticket, timeline) {
    const lastEvent = timeline[timeline.length - 1];
    if (ticket.linkedJira) {
      const jira = MockData.jiraIssues[ticket.linkedJira];
      return `Escalated to Engineering (${jira?.status || 'In Progress'})`;
    }
    if (lastEvent?.sender === 'customer') {
      return 'Awaiting agent response';
    }
    return 'Awaiting customer response';
  },

  suggestNextSteps(ticket, timeline) {
    const steps = [];

    if (!ticket.linkedJira && ticket.tier >= 2) {
      steps.push('Consider creating Jira ticket for engineering');
    }

    const lastMsg = timeline.filter(t => t.type === 'message').pop();
    if (lastMsg?.sender === 'customer') {
      steps.push('Respond to customer\'s latest message');
    }

    if (ticket.priority === 'high') {
      steps.push('Schedule follow-up call with customer');
    }

    steps.push('Update customer on investigation progress');

    return steps.slice(0, 3);
  },

  calculateTicketAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Less than 1 hour';
    if (diffHours < 24) return `${diffHours} hours`;
    const days = Math.floor(diffHours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  },

  // ============================================
  // 4. SIMILAR TICKETS FINDER
  // ============================================

  /**
   * Find similar tickets based on content analysis
   */
  async findSimilarTickets(ticket) {
    await this.simulateDelay();

    const currentTags = ticket.tags || [];
    const currentSubject = ticket.subject.toLowerCase();

    // Score all other tickets for similarity
    const similarTickets = MockData.tickets
      .filter(t => t.id !== ticket.id)
      .map(t => {
        let score = 0;

        // Tag overlap
        const tagOverlap = t.tags.filter(tag => currentTags.includes(tag)).length;
        score += tagOverlap * 25;

        // Subject word overlap
        const subjectWords = t.subject.toLowerCase().split(' ');
        const currentWords = currentSubject.split(' ');
        const wordOverlap = subjectWords.filter(w => currentWords.includes(w) && w.length > 3).length;
        score += wordOverlap * 15;

        // Same channel bonus
        if (t.channel === ticket.channel) score += 10;

        // Same customer company bonus (recurring issue)
        if (t.customerId === ticket.customerId) score += 20;

        return {
          ticket: t,
          score,
          matchReason: this.getSimilarityReason(tagOverlap, wordOverlap, t.customerId === ticket.customerId)
        };
      })
      .filter(t => t.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Add mock historical tickets for demo
    const historicalTickets = this.getMockHistoricalTickets(ticket);

    return [...similarTickets.map(s => ({
      id: s.ticket.id,
      subject: s.ticket.subject,
      status: s.ticket.status,
      similarity: Math.min(s.score, 95),
      matchReason: s.matchReason,
      resolution: s.ticket.status === 'resolved' ? 'Resolved via configuration change' : null,
      isHistorical: false
    })), ...historicalTickets];
  },

  getSimilarityReason(tagOverlap, wordOverlap, sameCustomer) {
    const reasons = [];
    if (tagOverlap > 0) reasons.push(`${tagOverlap} matching tags`);
    if (wordOverlap > 0) reasons.push('Similar subject');
    if (sameCustomer) reasons.push('Same customer');
    return reasons.join(', ') || 'Content similarity';
  },

  getMockHistoricalTickets(ticket) {
    // Mock historical resolved tickets for demo
    const historicalByTag = {
      'ivr': {
        id: 'TKT-2156',
        subject: 'IVR audio detection issues after CCaaS migration',
        status: 'resolved',
        similarity: 87,
        matchReason: 'Similar IVR migration issue',
        resolution: 'Resolved by updating RTP port configuration to match new platform',
        isHistorical: true
      },
      'chatbot': {
        id: 'TKT-2089',
        subject: 'Pulse NLU intent misclassification',
        status: 'resolved',
        similarity: 82,
        matchReason: 'Similar chatbot testing issue',
        resolution: 'Resolved by adjusting confidence thresholds and adding custom intents',
        isHistorical: true
      },
      'voice-quality': {
        id: 'TKT-1987',
        subject: 'Cruncher MOS degradation under load',
        status: 'resolved',
        similarity: 91,
        matchReason: 'Similar load testing issue',
        resolution: 'Root cause was QoS misconfiguration on customer network',
        isHistorical: true
      },
      'monitoring': {
        id: 'TKT-2201',
        subject: 'Velocity scheduled tests not executing',
        status: 'resolved',
        similarity: 89,
        matchReason: 'Same scheduling issue',
        resolution: 'Agent pool was exhausted - increased pool size resolved issue',
        isHistorical: true
      }
    };

    const matchingTag = ticket.tags.find(tag => historicalByTag[tag]);
    if (matchingTag) {
      return [historicalByTag[matchingTag]];
    }
    return [];
  },

  // ============================================
  // 5. KB GAP DETECTION
  // ============================================

  /**
   * Analyze tickets to detect KB gaps
   */
  async detectKBGaps(tickets) {
    await this.simulateDelay();

    // Analyze ticket patterns
    const tagFrequency = {};
    const unresolvedByTag = {};

    tickets.forEach(ticket => {
      ticket.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
          unresolvedByTag[tag] = (unresolvedByTag[tag] || 0) + 1;
        }
      });
    });

    // Find gaps - frequent issues with no/stale KB
    const gaps = [];

    // Check for topics without KB coverage
    const kbTopics = MockData.kbArticles.map(a => a.title.toLowerCase());

    for (const [tag, count] of Object.entries(tagFrequency)) {
      if (count >= 2) {
        const hasKBCoverage = kbTopics.some(topic => topic.includes(tag));
        const relatedKB = MockData.kbArticles.find(a =>
          a.title.toLowerCase().includes(tag) ||
          a.category.toLowerCase().includes(tag)
        );

        if (!hasKBCoverage) {
          gaps.push({
            topic: tag,
            type: 'missing',
            ticketCount: count,
            unresolvedCount: unresolvedByTag[tag] || 0,
            suggestion: `Create KB article for "${tag}" - ${count} tickets reference this topic`,
            priority: count >= 3 ? 'high' : 'medium'
          });
        } else if (relatedKB?.stale) {
          gaps.push({
            topic: tag,
            type: 'stale',
            ticketCount: count,
            relatedArticle: relatedKB,
            suggestion: `Update "${relatedKB.title}" - marked as stale but still referenced`,
            priority: 'medium'
          });
        }
      }
    }

    // Add suggested new articles
    const suggestedArticles = this.suggestNewArticles(tickets, gaps);

    return {
      gaps,
      suggestedArticles,
      staleArticles: MockData.kbArticles.filter(a => a.stale),
      analysisDate: new Date().toISOString()
    };
  },

  suggestNewArticles(tickets, gaps) {
    return gaps
      .filter(g => g.type === 'missing')
      .map(gap => ({
        suggestedTitle: this.generateArticleTitle(gap.topic),
        topic: gap.topic,
        basedOnTickets: gap.ticketCount,
        outline: this.generateArticleOutline(gap.topic)
      }));
  },

  generateArticleTitle(topic) {
    const templates = {
      'ivr': 'Troubleshooting IVR Test Failures',
      'chatbot': 'Chatbot Testing Best Practices',
      'voice-quality': 'Voice Quality Optimization Guide',
      'migration': 'CCaaS Migration Checklist',
      'monitoring': 'Setting Up Automated Monitoring',
      'api': 'API Integration Guide',
      'load-testing': 'Load Testing Configuration'
    };
    return templates[topic] || `Guide: Working with ${topic}`;
  },

  generateArticleOutline(topic) {
    return [
      'Overview and common use cases',
      'Step-by-step configuration',
      'Troubleshooting common issues',
      'Best practices and tips',
      'Related resources'
    ];
  },

  // ============================================
  // 6. SENTIMENT & URGENCY DETECTION
  // ============================================

  /**
   * Analyze sentiment and urgency of a message/ticket
   */
  async analyzeSentiment(ticket, timeline) {
    await this.simulateDelay();

    const messages = timeline.filter(t => t.type === 'message' && t.sender === 'customer');
    const allText = messages.map(m => m.content).join(' ').toLowerCase();

    // Sentiment analysis
    const sentiment = this.calculateSentiment(allText);

    // Urgency detection
    const urgency = this.detectUrgency(allText, ticket);

    // Frustration indicators
    const frustrationSignals = this.detectFrustration(messages);

    // Risk assessment
    const riskLevel = this.assessRisk(sentiment, urgency, frustrationSignals, ticket);

    return {
      sentiment: {
        score: sentiment.score,
        label: sentiment.label,
        indicators: sentiment.indicators
      },
      urgency: {
        level: urgency.level,
        signals: urgency.signals,
        deadline: urgency.deadline
      },
      frustration: {
        detected: frustrationSignals.length > 0,
        signals: frustrationSignals,
        escalating: this.isFrustrationEscalating(messages)
      },
      risk: riskLevel,
      recommendations: this.generateSentimentRecommendations(sentiment, urgency, frustrationSignals)
    };
  },

  calculateSentiment(text) {
    const positiveWords = ['thank', 'great', 'excellent', 'appreciate', 'helpful', 'works', 'resolved', 'perfect'];
    const negativeWords = ['frustrated', 'angry', 'unacceptable', 'terrible', 'worst', 'disappointed', 'failed', 'broken', 'useless', 'waste'];
    const neutralWords = ['okay', 'fine', 'alright'];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });

    const indicators = [];
    if (text.includes('!!!') || text.includes('???')) indicators.push('Emphatic punctuation');
    if (text.toUpperCase() === text && text.length > 20) indicators.push('ALL CAPS usage');
    if (negativeCount > 2) indicators.push('Multiple negative terms');

    let score, label;
    if (negativeCount > positiveCount + 1) {
      score = Math.max(20, 50 - (negativeCount * 10));
      label = 'Negative';
    } else if (positiveCount > negativeCount + 1) {
      score = Math.min(95, 70 + (positiveCount * 5));
      label = 'Positive';
    } else {
      score = 50 + ((positiveCount - negativeCount) * 10);
      label = 'Neutral';
    }

    return { score, label, indicators };
  },

  detectUrgency(text, ticket) {
    const urgentPhrases = [
      { phrase: 'asap', level: 'high' },
      { phrase: 'urgent', level: 'high' },
      { phrase: 'critical', level: 'critical' },
      { phrase: 'production down', level: 'critical' },
      { phrase: 'go-live', level: 'high' },
      { phrase: 'deadline', level: 'high' },
      { phrase: 'blocking', level: 'high' },
      { phrase: 'cannot proceed', level: 'high' },
      { phrase: 'showstopper', level: 'critical' }
    ];

    const signals = [];
    let maxLevel = 'normal';

    urgentPhrases.forEach(({ phrase, level }) => {
      if (text.includes(phrase)) {
        signals.push(phrase);
        if (level === 'critical' || (level === 'high' && maxLevel === 'normal')) {
          maxLevel = level;
        }
      }
    });

    // Check for deadline mentions
    let deadline = null;
    const deadlinePatterns = [
      /(\d+)\s*days?/i,
      /by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
      /end\s+of\s+(week|month|day)/i
    ];

    deadlinePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        deadline = match[0];
        if (maxLevel === 'normal') maxLevel = 'medium';
      }
    });

    // Enterprise customers get elevated urgency
    const customer = MockData.customers[ticket.customerId];
    if (customer?.tier === 'enterprise' && maxLevel === 'normal') {
      maxLevel = 'medium';
      signals.push('Enterprise customer');
    }

    return { level: maxLevel, signals, deadline };
  },

  detectFrustration(messages) {
    const signals = [];

    // Check for frustration patterns
    messages.forEach((msg, index) => {
      const content = msg.content.toLowerCase();

      if (content.includes('still') && content.includes('not')) {
        signals.push('Issue persisting ("still not working")');
      }
      if (content.includes('again') || content.includes('another')) {
        signals.push('Recurring issue mentioned');
      }
      if (content.includes('waited') || content.includes('waiting')) {
        signals.push('Extended wait time mentioned');
      }
      if (index > 0 && messages[index - 1].sender === 'customer') {
        signals.push('Multiple consecutive customer messages');
      }
    });

    return [...new Set(signals)];
  },

  isFrustrationEscalating(messages) {
    // Check if later messages are more negative than earlier ones
    if (messages.length < 2) return false;

    const firstSentiment = this.calculateSentiment(messages[0]?.content || '');
    const lastSentiment = this.calculateSentiment(messages[messages.length - 1]?.content || '');

    return lastSentiment.score < firstSentiment.score - 15;
  },

  assessRisk(sentiment, urgency, frustrationSignals, ticket) {
    let riskScore = 50;

    // Sentiment impact
    if (sentiment.label === 'Negative') riskScore += 20;
    if (sentiment.score < 30) riskScore += 15;

    // Urgency impact
    if (urgency.level === 'critical') riskScore += 25;
    if (urgency.level === 'high') riskScore += 15;

    // Frustration impact
    riskScore += frustrationSignals.length * 10;

    // Customer tier impact
    const customer = MockData.customers[ticket.customerId];
    if (customer?.tier === 'enterprise') riskScore += 15;

    // Cap at 100
    riskScore = Math.min(100, riskScore);

    let level, color;
    if (riskScore >= 80) {
      level = 'Critical';
      color = 'red';
    } else if (riskScore >= 60) {
      level = 'High';
      color = 'orange';
    } else if (riskScore >= 40) {
      level = 'Medium';
      color = 'yellow';
    } else {
      level = 'Low';
      color = 'green';
    }

    return { score: riskScore, level, color };
  },

  generateSentimentRecommendations(sentiment, urgency, frustrationSignals) {
    const recommendations = [];

    if (sentiment.label === 'Negative') {
      recommendations.push({
        action: 'Acknowledge concerns',
        description: 'Start response by acknowledging the customer\'s frustration'
      });
    }

    if (urgency.level === 'critical' || urgency.level === 'high') {
      recommendations.push({
        action: 'Prioritize response',
        description: 'Customer has indicated time-sensitive needs'
      });
    }

    if (frustrationSignals.length > 0) {
      recommendations.push({
        action: 'Consider call/meeting',
        description: 'Direct conversation may help resolve concerns faster'
      });
    }

    if (urgency.deadline) {
      recommendations.push({
        action: `Note deadline: ${urgency.deadline}`,
        description: 'Customer mentioned a specific timeline'
      });
    }

    return recommendations;
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, this.processingDelay));
  },

  containsAny(text, keywords) {
    return keywords.some(kw => text.includes(kw));
  },

  getLastCustomerMessage(timeline) {
    const customerMessages = timeline.filter(t => t.type === 'message' && t.sender === 'customer');
    return customerMessages[customerMessages.length - 1]?.content || '';
  },

  analyzeContext(ticket, timeline) {
    const text = `${ticket.subject} ${this.getLastCustomerMessage(timeline)}`.toLowerCase();

    return {
      isHowTo: this.containsAny(text, ['how to', 'how do i', 'can i', 'help me', 'guide', 'steps']),
      isTechnicalIssue: this.containsAny(text, ['error', 'failing', 'not working', 'broken', 'issue', 'problem']),
      needsEscalation: this.containsAny(text, ['urgent', 'critical', 'escalate', 'manager', 'immediate']),
      topic: this.extractTopic(text),
      suggestedTier: ticket.tier
    };
  },

  extractTopic(text) {
    const topics = ['ivr', 'chatbot', 'voice quality', 'load testing', 'monitoring', 'api', 'authentication', 'migration'];
    return topics.find(t => text.includes(t)) || 'general';
  },

  findRelevantKBArticles(ticket, lastMessage) {
    const searchText = `${ticket.subject} ${ticket.tags.join(' ')} ${lastMessage}`.toLowerCase();

    return MockData.kbArticles
      .map(article => {
        let relevance = 0;
        const titleWords = article.title.toLowerCase().split(' ');

        titleWords.forEach(word => {
          if (searchText.includes(word) && word.length > 3) {
            relevance += 20;
          }
        });

        ticket.tags.forEach(tag => {
          if (article.category.toLowerCase().includes(tag) || article.title.toLowerCase().includes(tag)) {
            relevance += 30;
          }
        });

        return { ...article, calculatedRelevance: relevance };
      })
      .filter(a => a.calculatedRelevance > 20)
      .sort((a, b) => b.calculatedRelevance - a.calculatedRelevance)
      .slice(0, 3);
  }
};

// Export
window.AI = AI;
