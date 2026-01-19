/**
 * Conversation Module for Hiver Omnichannel Prototype
 * Handles conversation timeline and reply functionality
 */

const Conversation = {
  currentTicket: null,

  /**
   * Initialize the conversation module
   */
  init() {
    this.bindEvents();
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Send button
    const sendBtn = document.getElementById('btn-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendReply());
    }

    // Reply textarea enter key
    const replyText = document.getElementById('reply-text');
    if (replyText) {
      replyText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          this.sendReply();
        }
      });
    }

    // KB Suggest button
    const kbBtn = document.getElementById('btn-kb-suggest');
    if (kbBtn) {
      kbBtn.addEventListener('click', () => this.showKbSuggestions());
    }

    // Canned response button
    const cannedBtn = document.getElementById('btn-canned');
    if (cannedBtn) {
      cannedBtn.addEventListener('click', () => this.showCannedResponses());
    }

    // Escalate button
    const escalateBtn = document.getElementById('btn-escalate');
    if (escalateBtn) {
      escalateBtn.addEventListener('click', () => {
        if (window.Escalation) {
          Escalation.showEscalationModal(this.currentTicket);
        }
      });
    }

    // ClickUp button
    const clickUpBtn = document.getElementById('btn-clickup');
    if (clickUpBtn) {
      clickUpBtn.addEventListener('click', () => this.showClickUpModal());
    }

    // Slack link button
    const slackBtn = document.getElementById('btn-slack-link');
    if (slackBtn) {
      slackBtn.addEventListener('click', () => this.showSlackLinkModal());
    }
  },

  /**
   * Load a ticket's conversation
   */
  loadTicket(ticketId) {
    const ticket = MockData.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    this.currentTicket = ticket;
    const customer = MockData.customers[ticket.customerId];
    const timeline = MockData.timelines[ticketId] || [];

    // Show conversation panel
    document.getElementById('conversation-empty').style.display = 'none';
    document.getElementById('conversation-content').style.display = 'flex';
    document.getElementById('context-panel').style.display = 'block';

    // Render header
    this.renderHeader(ticket, customer);

    // Render timeline
    this.renderTimeline(timeline);

    // Render context panel
    this.renderContextPanel(ticket, customer);

    // Scroll timeline to bottom
    const timelineEl = document.getElementById('conversation-timeline');
    timelineEl.scrollTop = timelineEl.scrollHeight;

    // Auto-run AI analysis to show insights bar
    if (window.AIUI) {
      AIUI.autoAnalyzeTicket(ticket);
    }
  },

  /**
   * Render conversation header
   */
  renderHeader(ticket, customer) {
    const header = document.getElementById('conversation-header');
    const status = Utils.getStatusDisplay(ticket.status);

    // Build channel badges
    const channelBadges = ticket.channels.map(ch =>
      `<span class="timeline-channel-badge ${ch}">${Utils.getChannelIcon(ch)} ${Utils.getChannelName(ch)}</span>`
    ).join('');

    header.innerHTML = `
      <div class="conversation-title">
        <h3>${Utils.escapeHtml(ticket.subject)}</h3>
        <span class="status-badge ${status.class}">${status.label}</span>
      </div>
      <div class="conversation-meta">
        <span><strong>${ticket.id}</strong></span>
        <span>•</span>
        <span>${Utils.escapeHtml(customer?.company || '')}</span>
        <span>•</span>
        <span>Channels: ${channelBadges}</span>
      </div>
    `;
  },

  /**
   * Render conversation timeline
   */
  renderTimeline(timeline) {
    const timelineEl = document.getElementById('conversation-timeline');

    if (timeline.length === 0) {
      timelineEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h4>No messages yet</h4>
          <p>Start the conversation by sending a message</p>
        </div>
      `;
      return;
    }

    timelineEl.innerHTML = timeline.map(item => this.renderTimelineItem(item)).join('');
  },

  /**
   * Render a single timeline item
   */
  renderTimelineItem(item) {
    if (item.type === 'system') {
      return this.renderSystemMessage(item);
    }

    const isCustomer = item.sender === 'customer';
    const isInternal = item.isInternal;
    const avatar = isCustomer ? Utils.getInitials(item.senderName) : 'AM';
    const avatarClass = isCustomer ? 'customer' : 'agent';

    let bodyClass = '';
    if (item.isSlackThread) bodyClass = 'slack-thread';
    if (item.channel === 'jira') bodyClass = 'jira-update';

    const internalTag = isInternal ? `<span class="timeline-channel-badge" style="background: #FEE2E2; color: #991B1B;">Internal</span>` : '';

    return `
      <div class="timeline-item">
        <div class="timeline-avatar ${avatarClass}">${avatar}</div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-sender">${Utils.escapeHtml(item.senderName)}</span>
            <span class="timeline-channel-badge ${item.channel}">
              ${Utils.getChannelIcon(item.channel)} ${Utils.getChannelName(item.channel)}
            </span>
            ${internalTag}
            <span class="timeline-time">${Utils.formatDateTime(item.timestamp)}</span>
          </div>
          <div class="timeline-body ${bodyClass}">
            ${Utils.nl2br(item.content)}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render a system message
   */
  renderSystemMessage(item) {
    const icon = item.channel === 'clickup' ? '🔗' : '⚙️';
    let statusBadge = '';

    if (item.clickUpStatus) {
      const statusClass = item.clickUpStatus === 'Resolved' ? 'success' :
                          item.clickUpStatus === 'In Progress' ? 'warning' : '';
      statusBadge = `<span class="status-badge ${statusClass}" style="margin-left: 8px;">${item.clickUpStatus}</span>`;
    }

    return `
      <div class="timeline-item">
        <div class="timeline-avatar system">${icon}</div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-sender">System</span>
            <span class="timeline-time">${Utils.formatDateTime(item.timestamp)}</span>
          </div>
          <div class="timeline-body system">
            ${Utils.escapeHtml(item.content)}${statusBadge}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render the context panel (right sidebar)
   */
  renderContextPanel(ticket, customer) {
    // Restore the original context panel HTML structure
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = `
      <!-- Customer Info -->
      <div class="context-section" id="customer-info">
        <h4>Customer</h4>
        <div class="customer-card" id="customer-card">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Account Information -->
      <div class="context-section" id="account-info-section">
        <h4>Account Information</h4>
        <div class="account-info" id="account-info">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Ticket Actions -->
      <div class="context-section">
        <h4>Actions</h4>
        <div class="action-buttons">
          <button class="btn btn-action" id="btn-escalate">
            <span>📈</span> Escalate
          </button>
          <button class="btn btn-action" id="btn-clickup">
            <span>🔗</span> Create ClickUp
          </button>
          <button class="btn btn-action" id="btn-slack-link">
            <span>💬</span> Link Slack
          </button>
        </div>
      </div>

      <!-- Escalation Status -->
      <div class="context-section" id="escalation-section">
        <h4>Escalation Path</h4>
        <div class="escalation-ladder" id="escalation-ladder">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Linked Items -->
      <div class="context-section" id="linked-items">
        <h4>Linked Items</h4>
        <div class="linked-list" id="linked-list">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- KB Suggestions -->
      <div class="context-section" id="kb-suggestions">
        <h4>Suggested Articles</h4>
        <div class="kb-list" id="kb-list">
          <!-- Rendered by JS -->
        </div>
      </div>
    `;

    // Re-bind action button events
    this.bindContextPanelEvents();

    // Customer card
    this.renderCustomerCard(customer);

    // Account information
    this.renderAccountInfo(customer);

    // Escalation ladder
    this.renderEscalationLadder(ticket);

    // Linked items
    this.renderLinkedItems(ticket);

    // KB suggestions
    this.renderKbSuggestions(ticket);
  },

  /**
   * Bind context panel action button events
   */
  bindContextPanelEvents() {
    // Escalate button
    const escalateBtn = document.getElementById('btn-escalate');
    if (escalateBtn) {
      escalateBtn.addEventListener('click', () => {
        if (window.Escalation) {
          Escalation.showEscalationModal(this.currentTicket);
        }
      });
    }

    // ClickUp button
    const clickUpBtn = document.getElementById('btn-clickup');
    if (clickUpBtn) {
      clickUpBtn.addEventListener('click', () => this.showClickUpModal());
    }

    // Slack link button
    const slackBtn = document.getElementById('btn-slack-link');
    if (slackBtn) {
      slackBtn.addEventListener('click', () => this.showSlackLinkModal());
    }
  },

  /**
   * Render account information (collapsible)
   */
  renderAccountInfo(customer) {
    const accountInfo = document.getElementById('account-info');
    if (!customer || !customer.account) {
      accountInfo.innerHTML = `
        <div class="empty-state" style="padding: 8px;">
          <p style="font-size: 12px; color: var(--gray-400);">No account information available</p>
        </div>
      `;
      return;
    }

    const account = customer.account;
    const healthClass = this.getHealthScoreClass(account.healthScore);
    const trendIcon = this.getHealthTrendIcon(account.healthTrend);
    const renewalDays = this.getDaysUntilRenewal(account.contractEnd);
    const renewalClass = renewalDays <= 90 ? 'renewal-urgent' : renewalDays <= 180 ? 'renewal-warning' : '';

    accountInfo.innerHTML = `
      <!-- Collapsed Summary (always visible) -->
      <div class="account-summary" id="account-summary">
        <div class="account-summary-row">
          <div class="summary-item">
            <span class="summary-value">$${this.formatCompactNumber(account.mrr)}</span>
            <span class="summary-label">MRR</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-value ${healthClass}">${account.healthScore}</span>
            <span class="summary-label">Health</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item ${renewalClass}">
            <span class="summary-value">${renewalDays}d</span>
            <span class="summary-label">Renewal</span>
          </div>
        </div>
        <button class="account-expand-btn" id="account-expand-btn">
          <span class="expand-icon">▼</span>
        </button>
      </div>

      <!-- Expanded Details (hidden by default) -->
      <div class="account-expanded" id="account-expanded">
        <!-- MRR & ARR -->
        <div class="account-metric-row primary">
          <div class="account-metric">
            <span class="metric-label">MRR</span>
            <span class="metric-value">$${Utils.formatNumber(account.mrr)}</span>
          </div>
          <div class="account-metric">
            <span class="metric-label">ARR</span>
            <span class="metric-value">$${Utils.formatNumber(account.arr)}</span>
          </div>
        </div>

        <!-- Health Score -->
        <div class="account-health">
          <div class="health-header">
            <span class="metric-label">Health Score</span>
            <span class="health-score ${healthClass}">${account.healthScore} ${trendIcon}</span>
          </div>
          <div class="health-bar">
            <div class="health-fill ${healthClass}" style="width: ${account.healthScore}%"></div>
          </div>
        </div>

        <!-- Contract & Renewal -->
        <div class="account-contract ${renewalClass}">
          <div class="contract-header">
            <span class="metric-label">Contract Renewal</span>
            <span class="contract-days">${renewalDays > 0 ? renewalDays + ' days' : 'Expired'}</span>
          </div>
          <span class="contract-date">${Utils.formatDate(account.contractEnd)}</span>
        </div>

        <!-- Details Grid -->
        <div class="account-details-grid">
          <div class="account-detail">
            <span class="detail-label">Support Plan</span>
            <span class="detail-value">${account.supportPlan}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">CSM</span>
            <span class="detail-value">${account.csm}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">Seats</span>
            <span class="detail-value">${account.seats}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">Total Tickets</span>
            <span class="detail-value">${account.totalTickets}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">Avg Resolution</span>
            <span class="detail-value">${account.avgResolutionTime}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">NPS Score</span>
            <span class="detail-value nps ${this.getNpsClass(account.npsScore)}">${account.npsScore}</span>
          </div>
        </div>

        <!-- Products -->
        <div class="account-products">
          <span class="detail-label">Products</span>
          <div class="product-tags">
            ${account.products.map(p => `<span class="product-tag">${p}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind expand/collapse toggle
    const expandBtn = document.getElementById('account-expand-btn');
    const summary = document.getElementById('account-summary');
    const expanded = document.getElementById('account-expanded');

    const toggleExpand = () => {
      const isExpanded = expanded.classList.contains('show');
      expanded.classList.toggle('show');
      expandBtn.classList.toggle('expanded');
    };

    expandBtn.addEventListener('click', toggleExpand);
    summary.addEventListener('click', (e) => {
      if (e.target !== expandBtn && !expandBtn.contains(e.target)) {
        toggleExpand();
      }
    });
  },

  /**
   * Format number to compact form (e.g., 125000 → "125K")
   */
  formatCompactNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  },

  /**
   * Get CSS class for health score
   */
  getHealthScoreClass(score) {
    if (score >= 80) return 'health-good';
    if (score >= 60) return 'health-warning';
    return 'health-critical';
  },

  /**
   * Get icon for health trend
   */
  getHealthTrendIcon(trend) {
    switch(trend) {
      case 'up': return '<span class="trend-up">↑</span>';
      case 'down': return '<span class="trend-down">↓</span>';
      default: return '<span class="trend-stable">→</span>';
    }
  },

  /**
   * Calculate days until contract renewal
   */
  getDaysUntilRenewal(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * Get CSS class for NPS score
   */
  getNpsClass(score) {
    if (score >= 70) return 'nps-promoter';
    if (score >= 50) return 'nps-passive';
    return 'nps-detractor';
  },

  /**
   * Render customer card
   */
  renderCustomerCard(customer) {
    const customerCard = document.getElementById('customer-card');
    if (!customer) return;

    const tierDisplay = Utils.getCustomerTierDisplay(customer.tier);

    customerCard.innerHTML = `
      <div class="customer-avatar">${customer.avatar}</div>
      <div class="customer-details">
        <div class="customer-name">${Utils.escapeHtml(customer.name)}</div>
        <div class="customer-company">${Utils.escapeHtml(customer.company)}</div>
      </div>
      <span class="customer-tier-badge ${tierDisplay.class}">${tierDisplay.label}</span>
    `;
  },

  /**
   * Render escalation ladder
   */
  renderEscalationLadder(ticket) {
    const ladder = document.getElementById('escalation-ladder');
    const currentTier = ticket.tier;
    const hasClickUp = !!ticket.linkedClickUp;

    const steps = [
      { tier: 0, label: 'L0 - First Response', icon: '0' },
      { tier: 1, label: 'L1 - Technical Support', icon: '1' },
      { tier: 2, label: 'L2 - Engineering', icon: '2' },
      { tier: 3, label: 'Engineering (ClickUp)', icon: '🔧' }
    ];

    ladder.innerHTML = steps.map(step => {
      let status = 'pending';
      if (step.tier < currentTier) status = 'completed';
      if (step.tier === currentTier) status = 'active';
      if (step.tier === 3 && hasClickUp) status = 'active';
      if (step.tier === 3 && !hasClickUp && currentTier < 3) status = 'pending';

      return `
        <div class="escalation-step ${status}">
          <div class="step-indicator">${status === 'completed' ? '✓' : step.icon}</div>
          <span class="step-label">${step.label}</span>
        </div>
      `;
    }).join('');
  },

  /**
   * Render linked items (ClickUp, Slack)
   */
  renderLinkedItems(ticket) {
    const linkedList = document.getElementById('linked-list');
    const items = [];

    if (ticket.linkedClickUp) {
      const clickUp = MockData.clickUpIssues[ticket.linkedClickUp];
      if (clickUp) {
        items.push(`
          <div class="linked-item" data-type="clickup" data-key="${clickUp.key}">
            <span class="linked-icon">🔗</span>
            <div class="linked-info">
              <div class="linked-title">${clickUp.key}: ${Utils.truncate(clickUp.summary, 30)}</div>
              <div class="linked-status">Status: ${clickUp.status}</div>
            </div>
          </div>
        `);
      }
    }

    if (ticket.linkedSlack) {
      const customer = MockData.customers[ticket.customerId];
      const slackMessages = this.getSlackMessages(ticket.id);
      items.push(`
        <div class="linked-item" data-type="slack">
          <span class="linked-icon">📱</span>
          <div class="linked-info">
            <div class="linked-title">Slack Thread</div>
            <div class="linked-status">${customer?.slackChannel || '#support'} • ${slackMessages.length} message(s)</div>
          </div>
        </div>
      `);
    }

    if (items.length === 0) {
      linkedList.innerHTML = `
        <div class="empty-state" style="padding: 8px;">
          <p style="font-size: 12px; color: var(--gray-400);">No linked items</p>
        </div>
      `;
    } else {
      linkedList.innerHTML = items.join('');
    }

    // Bind click events for linked items
    linkedList.querySelectorAll('.linked-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        if (type === 'slack') {
          this.showSlackThreadPanel(ticket);
        } else if (type === 'clickup') {
          this.showClickUpPanel(item.dataset.key);
        }
      });
    });
  },

  /**
   * Get Slack messages from timeline
   */
  getSlackMessages(ticketId) {
    const timeline = MockData.timelines[ticketId] || [];
    return timeline.filter(item => item.channel === 'slack' && item.type === 'message');
  },

  /**
   * Show Slack thread in the right panel (replaces context panel)
   */
  showSlackThreadPanel(ticket) {
    const contextPanel = document.getElementById('context-panel');
    const customer = MockData.customers[ticket.customerId];
    const slackMessages = this.getSlackMessages(ticket.id);

    let messagesHtml = '';
    if (slackMessages.length === 0) {
      messagesHtml = `
        <div class="empty-state" style="padding: 24px;">
          <div class="empty-state-icon">📱</div>
          <h4>No Slack messages yet</h4>
          <p>Messages from linked Slack threads will appear here</p>
        </div>
      `;
    } else {
      messagesHtml = slackMessages.map(msg => {
        const isInternal = msg.isInternal;
        const avatar = Utils.getInitials(msg.senderName);
        const internalBadge = isInternal ? '<span class="slack-internal-badge">Internal</span>' : '';

        return `
          <div class="slack-message ${isInternal ? 'internal' : ''}">
            <div class="slack-message-avatar">${avatar}</div>
            <div class="slack-message-content">
              <div class="slack-message-header">
                <span class="slack-message-sender">${Utils.escapeHtml(msg.senderName)}</span>
                ${internalBadge}
                <span class="slack-message-time">${Utils.formatDateTime(msg.timestamp)}</span>
              </div>
              <div class="slack-message-body">${Utils.nl2br(msg.content)}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    contextPanel.innerHTML = `
      <div class="slack-panel">
        <div class="slack-panel-header">
          <button class="btn btn-secondary slack-back-btn" id="slack-back-btn">
            ← Back
          </button>
          <div class="slack-panel-title">
            <span class="slack-channel-icon">📱</span>
            <span>${customer?.slackChannel || '#support'}</span>
          </div>
        </div>

        <div class="slack-thread-messages" id="slack-thread-messages">
          ${messagesHtml}
        </div>

        <div class="slack-panel-reply">
          <input type="text" class="form-input" id="slack-panel-reply-input"
                 placeholder="Reply in thread...">
          <button class="btn btn-primary" id="slack-panel-reply-send">Send</button>
        </div>
      </div>
    `;

    // Scroll to bottom of messages
    const messagesContainer = document.getElementById('slack-thread-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Bind back button
    document.getElementById('slack-back-btn').onclick = () => {
      this.renderContextPanel(ticket, customer);
    };

    // Bind reply
    const sendBtn = document.getElementById('slack-panel-reply-send');
    const input = document.getElementById('slack-panel-reply-input');
    if (sendBtn && input) {
      sendBtn.onclick = () => {
        const content = input.value.trim();
        if (content) {
          this.addSlackReply(ticket, content);
          input.value = '';
          this.showSlackThreadPanel(ticket); // Refresh panel
        }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendBtn.click();
        }
      });
    }
  },

  /**
   * Add a reply to Slack thread
   */
  addSlackReply(ticket, content) {
    MockData.timelines[ticket.id].push({
      id: `msg-${Date.now()}`,
      type: 'message',
      channel: 'slack',
      sender: 'agent',
      senderName: 'Harsha G',
      timestamp: new Date().toISOString(),
      content: content,
      isSlackThread: true
    });

    ticket.updatedAt = new Date().toISOString();
    this.loadTicket(ticket.id);
    Inbox.render();
    Utils.showToast('Reply sent to Slack thread', 'success');
  },

  /**
   * Show ClickUp task in the right panel (replaces context panel)
   */
  showClickUpPanel(clickUpKey) {
    const clickUp = MockData.clickUpIssues[clickUpKey];
    if (!clickUp) return;

    const contextPanel = document.getElementById('context-panel');
    const ticket = this.currentTicket;
    const customer = MockData.customers[ticket?.customerId];

    const statusClass = this.getClickUpStatusClass(clickUp.status);
    const priorityClass = this.getClickUpPriorityClass(clickUp.priority);

    // Build comments HTML
    const commentsHtml = (clickUp.comments || []).map(comment => `
      <div class="clickup-comment">
        <div class="clickup-comment-header">
          <span class="clickup-comment-author">${Utils.escapeHtml(comment.author)}</span>
          <span class="clickup-comment-time">${Utils.formatDateTime(comment.timestamp)}</span>
        </div>
        <div class="clickup-comment-body">${Utils.nl2br(comment.content)}</div>
      </div>
    `).join('');

    // Build labels HTML
    const labelsHtml = (clickUp.labels || []).map(label =>
      `<span class="clickup-label">${Utils.escapeHtml(label)}</span>`
    ).join('');

    // Build status dropdown options
    const statusOptions = MockData.clickUpStatuses.map(status =>
      `<option value="${status}" ${status === clickUp.status ? 'selected' : ''}>${status}</option>`
    ).join('');

    contextPanel.innerHTML = `
      <div class="clickup-panel">
        <div class="clickup-panel-header">
          <button class="btn btn-secondary clickup-back-btn" id="clickup-back-btn">
            ← Back
          </button>
          <div class="clickup-panel-title">
            <span class="clickup-key-badge">${clickUp.key}</span>
            <span class="clickup-type-badge">${clickUp.type || 'Bug'}</span>
          </div>
        </div>

        <div class="clickup-panel-content">
          <!-- Summary -->
          <div class="clickup-section">
            <h3 class="clickup-summary-title">${Utils.escapeHtml(clickUp.summary)}</h3>
          </div>

          <!-- Status & Priority -->
          <div class="clickup-section clickup-status-section">
            <div class="clickup-field">
              <label>Status</label>
              <select class="clickup-status-select ${statusClass}" id="clickup-status-select">
                ${statusOptions}
              </select>
            </div>
            <div class="clickup-field">
              <label>Priority</label>
              <span class="clickup-priority-badge ${priorityClass}">${clickUp.priority}</span>
            </div>
          </div>

          <!-- Details -->
          <div class="clickup-section">
            <div class="clickup-details-grid">
              <div class="clickup-field">
                <label>Assignee</label>
                <span>${Utils.escapeHtml(clickUp.assignee)}</span>
              </div>
              <div class="clickup-field">
                <label>Reporter</label>
                <span>${Utils.escapeHtml(clickUp.reporter || 'Harsha G')}</span>
              </div>
              <div class="clickup-field">
                <label>Created</label>
                <span>${Utils.formatDateTime(clickUp.created)}</span>
              </div>
              <div class="clickup-field">
                <label>Updated</label>
                <span>${Utils.formatDateTime(clickUp.updated)}</span>
              </div>
              <div class="clickup-field">
                <label>Linked Ticket</label>
                <span class="clickup-ticket-link">${clickUp.linkedTicket || ticket?.id || '-'}</span>
              </div>
            </div>
          </div>

          <!-- Labels -->
          ${labelsHtml ? `
          <div class="clickup-section">
            <label>Labels</label>
            <div class="clickup-labels">${labelsHtml}</div>
          </div>
          ` : ''}

          <!-- Description -->
          <div class="clickup-section">
            <label>Description</label>
            <div class="clickup-description">${Utils.nl2br(clickUp.description || 'No description')}</div>
          </div>

          <!-- Comments -->
          <div class="clickup-section clickup-comments-section">
            <label>Comments (${(clickUp.comments || []).length})</label>
            <div class="clickup-comments" id="clickup-comments">
              ${commentsHtml || '<p class="clickup-no-comments">No comments yet</p>'}
            </div>
          </div>
        </div>

        <!-- Add Comment -->
        <div class="clickup-panel-footer">
          <input type="text" class="form-input" id="clickup-comment-input"
                 placeholder="Add a comment...">
          <button class="btn btn-primary" id="clickup-comment-send">Add</button>
        </div>
      </div>
    `;

    // Scroll comments to bottom
    const commentsContainer = document.getElementById('clickup-comments');
    if (commentsContainer) {
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }

    // Bind back button
    document.getElementById('clickup-back-btn').onclick = () => {
      this.renderContextPanel(ticket, customer);
    };

    // Bind status change
    document.getElementById('clickup-status-select').onchange = (e) => {
      this.updateClickUpStatus(clickUpKey, e.target.value);
    };

    // Bind add comment
    const sendBtn = document.getElementById('clickup-comment-send');
    const input = document.getElementById('clickup-comment-input');
    if (sendBtn && input) {
      sendBtn.onclick = () => {
        const content = input.value.trim();
        if (content) {
          this.addClickUpComment(clickUpKey, content);
          input.value = '';
        }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendBtn.click();
        }
      });
    }
  },

  /**
   * Get CSS class for ClickUp status
   */
  getClickUpStatusClass(status) {
    const classes = {
      'Open': 'status-open',
      'In Progress': 'status-progress',
      'In Review': 'status-review',
      'Waiting On Cx Response': 'status-waiting',
      'Resolved': 'status-resolved',
      'Closed': 'status-closed'
    };
    return classes[status] || '';
  },

  /**
   * Get CSS class for ClickUp priority
   */
  getClickUpPriorityClass(priority) {
    const classes = {
      'Urgent': 'priority-urgent',
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return classes[priority] || '';
  },

  /**
   * Update ClickUp status (bi-directional sync)
   */
  updateClickUpStatus(clickUpKey, newStatus) {
    const clickUp = MockData.clickUpIssues[clickUpKey];
    if (!clickUp) return;

    const oldStatus = clickUp.status;
    clickUp.status = newStatus;
    clickUp.updated = new Date().toISOString();

    // Add comment about status change
    if (!clickUp.comments) clickUp.comments = [];
    clickUp.comments.push({
      id: `cc-${Date.now()}`,
      author: 'Harsha G',
      timestamp: new Date().toISOString(),
      content: `Status changed from "${oldStatus}" to "${newStatus}"`
    });

    // Sync back to ticket timeline
    if (this.currentTicket && clickUp.linkedTicket === this.currentTicket.id) {
      MockData.timelines[this.currentTicket.id].push({
        id: `msg-${Date.now()}`,
        type: 'system',
        channel: 'clickup',
        timestamp: new Date().toISOString(),
        content: `ClickUp ${clickUpKey} status changed: ${oldStatus} → ${newStatus}`,
        clickUpStatus: newStatus
      });

      // Update ticket status based on ClickUp
      if (newStatus === 'Resolved' || newStatus === 'Closed') {
        this.currentTicket.status = 'resolved';
      } else if (newStatus === 'Waiting On Cx Response') {
        this.currentTicket.status = 'waiting';
      }

      this.currentTicket.updatedAt = new Date().toISOString();
    }

    // Refresh UI
    this.showClickUpPanel(clickUpKey);
    this.renderTimeline(MockData.timelines[this.currentTicket?.id] || []);
    Inbox.render();

    Utils.showToast(`ClickUp ${clickUpKey} updated to "${newStatus}"`, 'success');
  },

  /**
   * Add comment to ClickUp task
   */
  addClickUpComment(clickUpKey, content) {
    const clickUp = MockData.clickUpIssues[clickUpKey];
    if (!clickUp) return;

    if (!clickUp.comments) clickUp.comments = [];
    clickUp.comments.push({
      id: `cc-${Date.now()}`,
      author: 'Harsha G',
      timestamp: new Date().toISOString(),
      content: content
    });

    clickUp.updated = new Date().toISOString();

    // Sync to ticket timeline
    if (this.currentTicket && clickUp.linkedTicket === this.currentTicket.id) {
      MockData.timelines[this.currentTicket.id].push({
        id: `msg-${Date.now()}`,
        type: 'system',
        channel: 'clickup',
        timestamp: new Date().toISOString(),
        content: `Comment added to ClickUp ${clickUpKey}: "${Utils.truncate(content, 50)}"`,
        clickUpStatus: clickUp.status
      });

      this.currentTicket.updatedAt = new Date().toISOString();
      this.renderTimeline(MockData.timelines[this.currentTicket.id]);
    }

    // Refresh ClickUp panel
    this.showClickUpPanel(clickUpKey);
    Inbox.render();

    Utils.showToast('Comment added to ClickUp', 'success');
  },

  /**
   * Render KB suggestions
   */
  renderKbSuggestions(ticket) {
    const kbList = document.getElementById('kb-list');

    // Find relevant articles based on ticket tags
    const relevantArticles = MockData.kbArticles
      .filter(article => {
        const keywords = [...ticket.tags, ticket.subject.toLowerCase()].join(' ');
        return article.title.toLowerCase().split(' ').some(word => keywords.includes(word.toLowerCase()));
      })
      .slice(0, 3);

    if (relevantArticles.length === 0) {
      kbList.innerHTML = `
        <div class="empty-state" style="padding: 8px;">
          <p style="font-size: 12px; color: var(--gray-400);">No suggestions available</p>
        </div>
      `;
      return;
    }

    kbList.innerHTML = relevantArticles.map(article => `
      <div class="kb-item" data-article-id="${article.id}">
        <div class="kb-title">${Utils.escapeHtml(article.title)}</div>
        <div class="kb-meta">
          <span class="kb-relevance">${article.relevance}% match</span>
          <span>•</span>
          <span>${article.stale ? '⚠️ Stale' : 'Updated ' + article.lastUpdated}</span>
        </div>
      </div>
    `).join('');

    // Bind click events
    kbList.querySelectorAll('.kb-item').forEach(item => {
      item.addEventListener('click', () => {
        Utils.showToast(`Opening article: ${item.querySelector('.kb-title').textContent}`, 'info');
      });
    });
  },

  /**
   * Send a reply
   */
  sendReply() {
    const replyText = document.getElementById('reply-text');
    const replyChannel = document.getElementById('reply-channel');
    const content = replyText.value.trim();

    if (!content) {
      Utils.showToast('Please enter a message', 'warning');
      return;
    }

    if (!this.currentTicket) {
      Utils.showToast('No ticket selected', 'error');
      return;
    }

    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      type: 'message',
      channel: replyChannel.value,
      sender: 'agent',
      senderName: 'Harsha G',
      timestamp: new Date().toISOString(),
      content: content
    };

    // Add to timeline
    if (!MockData.timelines[this.currentTicket.id]) {
      MockData.timelines[this.currentTicket.id] = [];
    }
    MockData.timelines[this.currentTicket.id].push(newMessage);

    // Update ticket
    this.currentTicket.updatedAt = new Date().toISOString();

    // Clear reply box
    replyText.value = '';

    // Re-render
    this.renderTimeline(MockData.timelines[this.currentTicket.id]);
    Inbox.render();

    // Scroll to bottom
    const timelineEl = document.getElementById('conversation-timeline');
    timelineEl.scrollTop = timelineEl.scrollHeight;

    Utils.showToast(`Reply sent via ${Utils.getChannelName(replyChannel.value)}`, 'success');
  },

  /**
   * Show KB suggestions modal
   */
  showKbSuggestions() {
    Utils.showToast('KB suggestion feature - would open article search', 'info');
  },

  /**
   * Show canned responses
   */
  showCannedResponses() {
    Utils.showToast('Canned responses feature - would show template list', 'info');
  },

  /**
   * Show ClickUp creation modal
   */
  showClickUpModal() {
    if (!this.currentTicket) return;

    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = 'Create ClickUp Task';
    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label">Summary</label>
        <input type="text" class="form-input" id="clickup-summary"
               value="${Utils.escapeHtml(this.currentTicket.subject)}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="clickup-description">Ticket: ${this.currentTicket.id}
Customer: ${MockData.customers[this.currentTicket.customerId]?.name}

[Context from conversation will be included]</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">L3 Team</label>
        <select class="form-select" id="clickup-team">
          <option value="Admirals">Admirals</option>
          <option value="Backend Team">Backend Team</option>
          <option value="Frontend Team">Frontend Team</option>
        </select>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="modal-confirm">Create Task</button>
    `;

    modal.style.display = 'flex';

    // Bind events
    document.getElementById('modal-cancel').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-close').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-confirm').onclick = () => {
      const summary = document.getElementById('clickup-summary').value;
      const clickUpKey = `86d${Math.random().toString(36).substring(2, 8)}`;

      // Add ClickUp to mock data
      MockData.clickUpIssues[clickUpKey] = {
        key: clickUpKey,
        summary: summary,
        status: 'Open',
        priority: 'Medium',
        type: 'Bug',
        assignee: document.getElementById('clickup-team').value,
        reporter: 'Harsha G',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        linkedTicket: this.currentTicket.id,
        labels: [],
        comments: []
      };

      // Link to ticket
      this.currentTicket.linkedClickUp = clickUpKey;
      this.currentTicket.channels.push('clickup');

      // Add system message
      MockData.timelines[this.currentTicket.id].push({
        id: `msg-${Date.now()}`,
        type: 'system',
        channel: 'clickup',
        timestamp: new Date().toISOString(),
        content: `ClickUp task ${clickUpKey} created: "${summary}"`,
        clickUpStatus: 'Open'
      });

      modal.style.display = 'none';
      this.loadTicket(this.currentTicket.id);
      Inbox.render();
      Utils.showToast(`ClickUp task ${clickUpKey} created`, 'success');
    };
  },

  /**
   * Show Slack link modal
   */
  showSlackLinkModal() {
    if (!this.currentTicket) return;

    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = 'Link Slack Thread';
    modalBody.innerHTML = `
      <p style="margin-bottom: 16px; color: var(--gray-600);">
        Capture context from a Slack conversation and link it to this ticket.
      </p>
      <div class="form-group">
        <label class="form-label">Slack Channel</label>
        <select class="form-select" id="slack-channel">
          <option value="#support-internal">🔒 #support-internal</option>
          <option value="#engineering">🔒 #engineering</option>
          <option value="#techcorp-support">#techcorp-support (Shared)</option>
          <option value="#globalfinance-vip">#globalfinance-vip (Shared)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Thread URL (optional)</label>
        <input type="text" class="form-input" id="slack-url"
               placeholder="https://slack.com/archives/...">
      </div>
      <div class="form-group">
        <label class="form-label">Context to capture</label>
        <textarea class="form-textarea" id="slack-context"
                  placeholder="Paste key messages or summary from the Slack thread..."></textarea>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="modal-confirm">Link Thread</button>
    `;

    modal.style.display = 'flex';

    // Bind events
    document.getElementById('modal-cancel').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-close').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-confirm').onclick = () => {
      const channel = document.getElementById('slack-channel').value;
      const context = document.getElementById('slack-context').value;

      // Link Slack to ticket
      this.currentTicket.linkedSlack = true;
      if (!this.currentTicket.channels.includes('slack')) {
        this.currentTicket.channels.push('slack');
      }

      // Add context as message if provided
      if (context.trim()) {
        MockData.timelines[this.currentTicket.id].push({
          id: `msg-${Date.now()}`,
          type: 'message',
          channel: 'slack',
          sender: 'internal',
          senderName: 'Slack Context',
          timestamp: new Date().toISOString(),
          content: context,
          isSlackThread: true,
          isInternal: true
        });
      }

      // Add system message
      MockData.timelines[this.currentTicket.id].push({
        id: `msg-${Date.now() + 1}`,
        type: 'system',
        channel: 'system',
        timestamp: new Date().toISOString(),
        content: `Slack thread from ${channel} linked to this ticket`
      });

      modal.style.display = 'none';
      this.loadTicket(this.currentTicket.id);
      Inbox.render();
      Utils.showToast('Slack thread linked successfully', 'success');
    };
  }
};

// Export for use in other modules
window.Conversation = Conversation;
