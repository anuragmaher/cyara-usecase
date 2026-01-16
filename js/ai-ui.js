/**
 * AI UI Integration for Hiver Omnichannel Prototype
 * Connects AI module to the user interface
 */

const AIUI = {
  drawerOpen: false,
  currentAnalysis: null,

  /**
   * Initialize AI UI components
   */
  init() {
    this.createAIDrawer();
    this.createAIFloatingButton();
    this.bindEvents();
    console.log('AI UI initialized');
  },

  /**
   * Create the AI drawer (side panel)
   */
  createAIDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'ai-drawer';
    drawer.className = 'ai-drawer';
    drawer.innerHTML = `
      <div class="ai-drawer-header">
        <div class="ai-drawer-title">
          <span>🤖</span>
          <span>AI Assistant</span>
        </div>
        <button class="ai-drawer-close" id="ai-drawer-close">&times;</button>
      </div>
      <div class="ai-drawer-body" id="ai-drawer-body">
        <div class="ai-loading">
          <div class="ai-loading-spinner"></div>
          <span class="ai-loading-text">Select a ticket to analyze...</span>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    const overlay = document.createElement('div');
    overlay.id = 'ai-drawer-overlay';
    overlay.className = 'ai-drawer-overlay';
    document.body.appendChild(overlay);
  },

  /**
   * Create floating AI button
   */
  createAIFloatingButton() {
    const btn = document.createElement('button');
    btn.id = 'ai-floating-btn';
    btn.className = 'ai-floating-btn';
    btn.innerHTML = '🤖';
    btn.title = 'AI Assistant';
    document.body.appendChild(btn);
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Floating button
    document.getElementById('ai-floating-btn')?.addEventListener('click', () => {
      this.toggleDrawer();
    });

    // Drawer close
    document.getElementById('ai-drawer-close')?.addEventListener('click', () => {
      this.closeDrawer();
    });

    // Overlay click
    document.getElementById('ai-drawer-overlay')?.addEventListener('click', () => {
      this.closeDrawer();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawerOpen) {
        this.closeDrawer();
      }
    });
  },

  /**
   * Toggle AI drawer
   */
  toggleDrawer() {
    if (this.drawerOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  /**
   * Open AI drawer
   */
  openDrawer() {
    document.getElementById('ai-drawer')?.classList.add('open');
    document.getElementById('ai-drawer-overlay')?.classList.add('open');
    this.drawerOpen = true;

    // Analyze current ticket
    if (Conversation.currentTicket) {
      this.analyzeTicket(Conversation.currentTicket);
    }
  },

  /**
   * Close AI drawer
   */
  closeDrawer() {
    document.getElementById('ai-drawer')?.classList.remove('open');
    document.getElementById('ai-drawer-overlay')?.classList.remove('open');
    this.drawerOpen = false;
  },

  /**
   * Analyze current ticket with all AI features
   */
  async analyzeTicket(ticket) {
    const drawerBody = document.getElementById('ai-drawer-body');
    if (!drawerBody) return;

    // Show loading
    drawerBody.innerHTML = `
      <div class="ai-loading">
        <div class="ai-loading-spinner"></div>
        <span class="ai-loading-text">Analyzing ticket...</span>
      </div>
    `;

    const timeline = MockData.timelines[ticket.id] || [];
    const customer = MockData.customers[ticket.customerId];

    try {
      // Run all AI analyses in parallel
      const [sentiment, triage, summary, similar, replySuggestions] = await Promise.all([
        AI.analyzeSentiment(ticket, timeline),
        AI.autoTriage(ticket.subject, timeline[0]?.content || '', customer?.tier),
        AI.generateSummary(ticket, timeline),
        AI.findSimilarTickets(ticket),
        AI.generateReplySuggestions(ticket, timeline)
      ]);

      this.currentAnalysis = { sentiment, triage, summary, similar, replySuggestions };

      // Render all AI insights
      this.renderAIInsights(drawerBody, ticket, {
        sentiment,
        triage,
        summary,
        similar,
        replySuggestions
      });

      // Update insights bar in conversation
      this.updateInsightsBar(ticket, sentiment, triage);

    } catch (error) {
      console.error('AI analysis failed:', error);
      drawerBody.innerHTML = `
        <div class="ai-loading">
          <span class="ai-loading-text">Analysis failed. Please try again.</span>
        </div>
      `;
    }
  },

  /**
   * Render all AI insights in drawer
   */
  renderAIInsights(container, ticket, analysis) {
    const { sentiment, triage, summary, similar, replySuggestions } = analysis;

    container.innerHTML = `
      <!-- Sentiment & Risk Section -->
      <div class="ai-drawer-section">
        <div class="ai-drawer-section-title">
          <span>📊</span> Sentiment & Risk Analysis
        </div>
        ${this.renderSentimentCard(sentiment)}
      </div>

      <!-- Smart Reply Suggestions -->
      <div class="ai-drawer-section">
        <div class="ai-drawer-section-title">
          <span>💬</span> Smart Reply Suggestions
        </div>
        ${this.renderReplySuggestions(replySuggestions)}
      </div>

      <!-- Auto-Triage -->
      <div class="ai-drawer-section">
        <div class="ai-drawer-section-title">
          <span>🎯</span> Auto-Triage Recommendation
        </div>
        ${this.renderTriageCard(triage, ticket)}
      </div>

      <!-- Conversation Summary -->
      <div class="ai-drawer-section">
        <div class="ai-drawer-section-title">
          <span>📝</span> Conversation Summary
        </div>
        ${this.renderSummaryCard(summary)}
      </div>

      <!-- Similar Tickets -->
      <div class="ai-drawer-section">
        <div class="ai-drawer-section-title">
          <span>🔍</span> Similar Tickets
        </div>
        ${this.renderSimilarTickets(similar)}
      </div>
    `;

    // Bind suggestion click handlers
    this.bindSuggestionHandlers(replySuggestions);
  },

  /**
   * Render sentiment analysis card
   */
  renderSentimentCard(sentiment) {
    const sentimentClass = sentiment.sentiment.label.toLowerCase();
    const urgencyClass = sentiment.urgency.level;
    const riskWidth = sentiment.risk.score;

    return `
      <div class="ai-sentiment">
        <div class="ai-sentiment-header">
          <div class="ai-sentiment-score ${sentimentClass}">
            <span class="score-value">${sentiment.sentiment.score}</span>
            <span class="score-label">${sentiment.sentiment.label}</span>
          </div>
          <div class="ai-sentiment-details">
            <div class="ai-sentiment-label">Customer Sentiment</div>
            <div class="ai-sentiment-indicators">
              ${sentiment.sentiment.indicators.length > 0
                ? sentiment.sentiment.indicators.join(', ')
                : 'No concerning indicators detected'}
            </div>
          </div>
        </div>

        <div class="ai-meters">
          <div class="ai-meter">
            <div class="ai-meter-label">Urgency</div>
            <div class="ai-meter-bar">
              <div class="ai-meter-fill ${urgencyClass}"
                   style="width: ${this.getUrgencyPercent(sentiment.urgency.level)}%"></div>
            </div>
            <div class="ai-meter-value">${this.capitalizeFirst(sentiment.urgency.level)}</div>
          </div>
          <div class="ai-meter">
            <div class="ai-meter-label">Risk Level</div>
            <div class="ai-meter-bar">
              <div class="ai-meter-fill ${sentiment.risk.color}"
                   style="width: ${riskWidth}%"></div>
            </div>
            <div class="ai-meter-value">${sentiment.risk.level} (${sentiment.risk.score})</div>
          </div>
        </div>

        ${sentiment.frustration.detected ? `
          <div style="padding: 8px; background: #fee2e2; border-radius: 4px; margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 600; color: #991b1b; margin-bottom: 4px;">
              ⚠️ Frustration Detected
            </div>
            <div style="font-size: 11px; color: #7f1d1d;">
              ${sentiment.frustration.signals.join(', ')}
            </div>
          </div>
        ` : ''}

        ${sentiment.recommendations.length > 0 ? `
          <div class="ai-recommendations">
            ${sentiment.recommendations.map(rec => `
              <div class="ai-recommendation">
                <span class="ai-recommendation-icon">💡</span>
                <div class="ai-recommendation-text">
                  <div class="ai-recommendation-action">${rec.action}</div>
                  <div class="ai-recommendation-desc">${rec.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Render reply suggestions
   */
  renderReplySuggestions(data) {
    if (!data.suggestions || data.suggestions.length === 0) {
      return '<p style="color: var(--gray-400); font-size: 12px;">No suggestions available</p>';
    }

    const icons = {
      'how-to': '📖',
      'troubleshooting': '🔧',
      'escalation': '📈',
      'clarification': '❓'
    };

    return `
      <div class="ai-suggestions">
        ${data.suggestions.map(sug => `
          <div class="ai-suggestion-card" data-suggestion-id="${sug.id}">
            <div class="ai-suggestion-icon ${sug.type}">${icons[sug.type] || '💬'}</div>
            <div class="ai-suggestion-content">
              <div class="ai-suggestion-title">${sug.title}</div>
              <div class="ai-suggestion-preview">${sug.preview}</div>
              ${sug.kbReference ? `
                <div class="ai-suggestion-kb">📚 ${sug.kbReference.title}</div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 8px; font-size: 11px; color: var(--gray-400);">
        Confidence: ${data.confidence}% • Click to use suggestion
      </div>
    `;
  },

  /**
   * Render triage card
   */
  renderTriageCard(triage, ticket) {
    const tierMatch = triage.tier.value === ticket.tier;
    const priorityMatch = triage.priority.value === ticket.priority;

    return `
      <div class="ai-triage">
        <div class="ai-triage-grid">
          <div class="ai-triage-item">
            <div class="ai-triage-label">Suggested Tier</div>
            <div class="ai-triage-value">
              <span class="ticket-tier tier-${triage.tier.value}">Tier ${triage.tier.value}</span>
              ${tierMatch ? '✓' : `<span style="color: #f59e0b; font-size: 11px;">(Current: ${ticket.tier})</span>`}
            </div>
            <div class="ai-triage-confidence">${triage.tier.confidence}% confident</div>
          </div>
          <div class="ai-triage-item">
            <div class="ai-triage-label">Suggested Priority</div>
            <div class="ai-triage-value">
              <span class="ticket-priority ${triage.priority.value}">${this.capitalizeFirst(triage.priority.value)}</span>
              ${priorityMatch ? '✓' : `<span style="color: #f59e0b; font-size: 11px;">(Current: ${ticket.priority})</span>`}
            </div>
            <div class="ai-triage-confidence">${triage.priority.confidence}% confident</div>
          </div>
        </div>

        <div class="ai-triage-item" style="margin-bottom: 12px;">
          <div class="ai-triage-label">Category</div>
          <div class="ai-triage-value">
            ${triage.category.icon} ${triage.category.name}
          </div>
        </div>

        <div class="ai-triage-item">
          <div class="ai-triage-label">Suggested Tags</div>
          <div class="ai-triage-tags">
            ${triage.tags.map(tag => {
              const isNew = !ticket.tags.includes(tag);
              return `<span class="ai-triage-tag ${isNew ? '' : 'selected'}">${tag}${isNew ? ' +' : ''}</span>`;
            }).join('')}
          </div>
        </div>

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
          <div class="ai-triage-label">Suggested Assignee</div>
          <div style="font-size: 13px; font-weight: 500;">${triage.suggestedAssignee}</div>
        </div>

        <button class="ai-action-btn" style="margin-top: 12px; width: 100%; justify-content: center;"
                onclick="AIUI.applyTriage()">
          Apply AI Recommendations
        </button>
      </div>
    `;
  },

  /**
   * Render summary card
   */
  renderSummaryCard(summary) {
    return `
      <div class="ai-summary">
        <div class="ai-summary-section">
          <div class="ai-summary-label">📋 Overview</div>
          <div class="ai-summary-meta">
            <span class="ai-summary-meta-item"><strong>${summary.overview.customer}</strong> (${summary.overview.company})</span>
            <span class="ai-summary-meta-item">Tier: <strong>${summary.overview.customerTier}</strong></span>
            <span class="ai-summary-meta-item">Age: <strong>${summary.overview.ticketAge}</strong></span>
            <span class="ai-summary-meta-item">Messages: <strong>${summary.overview.messageCount}</strong></span>
          </div>
        </div>

        <div class="ai-summary-section">
          <div class="ai-summary-label">🎯 Problem</div>
          <div class="ai-summary-text">${summary.problem}</div>
        </div>

        <div class="ai-summary-section">
          <div class="ai-summary-label">📍 Current Status</div>
          <div class="ai-summary-text">${summary.currentStatus}</div>
        </div>

        ${summary.keyFindings.length > 0 ? `
          <div class="ai-summary-section">
            <div class="ai-summary-label">🔍 Key Findings</div>
            <ul class="ai-summary-list">
              ${summary.keyFindings.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="ai-summary-section">
          <div class="ai-summary-label">📌 Suggested Next Steps</div>
          <ul class="ai-summary-list">
            ${summary.nextSteps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <button class="ai-action-btn" style="margin-top: 8px;"
                onclick="AIUI.copySummary()">
          Copy Summary for Escalation
        </button>
      </div>
    `;
  },

  /**
   * Render similar tickets
   */
  renderSimilarTickets(similar) {
    if (!similar || similar.length === 0) {
      return '<p style="color: var(--gray-400); font-size: 12px;">No similar tickets found</p>';
    }

    return `
      <div class="ai-similar-tickets">
        ${similar.map(ticket => `
          <div class="ai-similar-ticket ${ticket.resolution ? 'has-resolution' : ''}"
               onclick="AIUI.viewSimilarTicket('${ticket.id}')">
            <div class="ai-similarity-score">${ticket.similarity}%</div>
            <div class="ai-similar-content">
              <div class="ai-similar-title">${ticket.subject}</div>
              <div class="ai-similar-meta">
                ${ticket.id} • ${ticket.matchReason}
                ${ticket.isHistorical ? ' • Historical' : ''}
              </div>
              ${ticket.resolution ? `
                <div class="ai-similar-resolution">✓ ${ticket.resolution}</div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Update insights bar in conversation header
   */
  updateInsightsBar(ticket, sentiment, triage) {
    // Check if insights bar exists, create if not
    let insightsBar = document.querySelector('.ai-insights-bar');
    const header = document.getElementById('conversation-header');

    if (!header) return;

    if (!insightsBar) {
      insightsBar = document.createElement('div');
      insightsBar.className = 'ai-insights-bar';
      header.parentNode.insertBefore(insightsBar, header.nextSibling);
    }

    const sentimentClass = sentiment.sentiment.label.toLowerCase();
    const urgencyClass = sentiment.urgency.level;

    insightsBar.innerHTML = `
      <span class="ai-badge">AI Insights</span>
      <div class="ai-insight-item">
        <span class="ai-insight-label">Sentiment:</span>
        <span class="ai-insight-value ${sentimentClass}">${sentiment.sentiment.label} (${sentiment.sentiment.score})</span>
      </div>
      <div class="ai-insight-item">
        <span class="ai-insight-label">Urgency:</span>
        <span class="ai-insight-value ${urgencyClass}">${this.capitalizeFirst(sentiment.urgency.level)}</span>
      </div>
      <div class="ai-insight-item">
        <span class="ai-insight-label">Risk:</span>
        <span class="ai-insight-value" style="color: ${sentiment.risk.color === 'red' ? '#ef4444' : sentiment.risk.color === 'orange' ? '#f97316' : '#22c55e'}">${sentiment.risk.level}</span>
      </div>
      ${sentiment.frustration.detected ? `
        <div class="ai-insight-item">
          <span class="ai-insight-value negative">⚠️ Frustration Detected</span>
        </div>
      ` : ''}
      <button class="ai-action-btn" onclick="AIUI.openDrawer()" style="margin-left: auto;">
        View Full Analysis
      </button>
    `;
  },

  /**
   * Bind suggestion click handlers
   */
  bindSuggestionHandlers(data) {
    document.querySelectorAll('.ai-suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        const suggestionId = card.dataset.suggestionId;
        const suggestion = data.suggestions.find(s => s.id === suggestionId);
        if (suggestion) {
          this.applySuggestion(suggestion);
        }
      });
    });
  },

  /**
   * Apply a suggestion to reply box
   */
  applySuggestion(suggestion) {
    const replyBox = document.getElementById('reply-text');
    if (replyBox) {
      replyBox.value = suggestion.content;
      replyBox.focus();
      this.closeDrawer();
      Utils.showToast('Suggestion applied to reply box', 'success');
    }
  },

  /**
   * Apply triage recommendations
   */
  applyTriage() {
    if (!this.currentAnalysis || !Conversation.currentTicket) return;

    const { triage } = this.currentAnalysis;
    const ticket = Conversation.currentTicket;

    // Update ticket
    ticket.tier = triage.tier.value;
    ticket.priority = triage.priority.value;
    ticket.tags = [...new Set([...ticket.tags, ...triage.tags])];

    // Refresh UI
    Inbox.render();
    Conversation.loadTicket(ticket.id);

    Utils.showToast('AI triage recommendations applied', 'success');
  },

  /**
   * Copy summary for escalation
   */
  copySummary() {
    if (!this.currentAnalysis) return;

    const { summary } = this.currentAnalysis;

    const text = `
TICKET SUMMARY (AI Generated)
=============================

Customer: ${summary.overview.customer} (${summary.overview.company})
Customer Tier: ${summary.overview.customerTier}
Ticket Age: ${summary.overview.ticketAge}
Messages: ${summary.overview.messageCount}

PROBLEM:
${summary.problem}

CURRENT STATUS:
${summary.currentStatus}

KEY FINDINGS:
${summary.keyFindings.map(f => '• ' + f).join('\n')}

SUGGESTED NEXT STEPS:
${summary.nextSteps.map(s => '• ' + s).join('\n')}

Generated: ${new Date().toLocaleString()}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      Utils.showToast('Summary copied to clipboard', 'success');
    }).catch(() => {
      Utils.showToast('Failed to copy summary', 'error');
    });
  },

  /**
   * View similar ticket
   */
  viewSimilarTicket(ticketId) {
    const ticket = MockData.tickets.find(t => t.id === ticketId);
    if (ticket) {
      Inbox.selectTicket(ticketId);
      this.closeDrawer();
    } else {
      // Historical ticket - show info
      Utils.showToast(`Historical ticket ${ticketId} - would open in archive`, 'info');
    }
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  getUrgencyPercent(level) {
    const levels = { 'normal': 25, 'medium': 50, 'high': 75, 'critical': 100 };
    return levels[level] || 25;
  },

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// Export
window.AIUI = AIUI;
