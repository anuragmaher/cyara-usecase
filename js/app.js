/**
 * Main Application Controller for Hiver Omnichannel Prototype
 * Initializes all modules and handles global interactions
 */

const App = {
  currentView: 'inbox',

  /**
   * Initialize the application
   */
  init() {
    console.log('Hiver Omnichannel Prototype - Initializing...');

    // Initialize all modules
    Inbox.init();
    Conversation.init();
    Escalation.init();

    // Initialize AI modules
    if (window.AI) AI.init();
    if (window.AIUI) AIUI.init();

    // Bind global events
    this.bindEvents();

    // Load initial state
    this.loadInitialState();

    console.log('Hiver Omnichannel Prototype - Ready!');
  },

  /**
   * Bind global event listeners
   */
  bindEvents() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView(item.dataset.view);
      });
    });

    // Modal close on overlay click
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.style.display = 'none';
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape to close modal
      if (e.key === 'Escape') {
        const modal = document.getElementById('modal-overlay');
        if (modal && modal.style.display === 'flex') {
          modal.style.display = 'none';
        }
      }

      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('inbox-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  },

  /**
   * Switch between views (inbox, escalations, etc.)
   */
  switchView(view) {
    this.currentView = view;

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === view);
    });

    // Handle view-specific content
    switch (view) {
      case 'inbox':
        this.showInboxView();
        break;
      case 'escalations':
        this.showEscalationsView();
        break;
      case 'knowledge':
        this.showKnowledgeView();
        break;
      case 'analytics':
        this.showAnalyticsView();
        break;
      default:
        this.showInboxView();
    }
  },

  /**
   * Show inbox view (default)
   */
  showInboxView() {
    document.getElementById('inbox-panel').style.display = 'flex';
    Inbox.render();
  },

  /**
   * Show escalations view
   */
  showEscalationsView() {
    Utils.showToast('Escalations View - Shows visual pipeline of tickets by tier', 'info');
    // In a full implementation, this would show a kanban-style board
  },

  /**
   * Show knowledge base view
   */
  showKnowledgeView() {
    Utils.showToast('Knowledge Base - Browse and manage 2,000+ articles', 'info');
    // In a full implementation, this would show KB management
  },

  /**
   * Show analytics view
   */
  showAnalyticsView() {
    Utils.showToast('Analytics - Multi-dimensional reporting by tier, channel, customer', 'info');
    // In a full implementation, this would show dashboards
  },

  /**
   * Load initial state
   */
  loadInitialState() {
    // Auto-select first ticket if on inbox view
    if (this.currentView === 'inbox' && MockData.tickets.length > 0) {
      // Don't auto-select, let user choose
    }

    // Show welcome message
    this.showWelcomeToast();
  },

  /**
   * Show welcome toast
   */
  showWelcomeToast() {
    setTimeout(() => {
      Utils.showToast('Welcome to Hiver Omnichannel Prototype', 'info');
    }, 500);
  },

  /**
   * Simulate real-time ClickUp update
   */
  simulateClickUpUpdate(ticketId, clickUpKey, newStatus) {
    const ticket = MockData.tickets.find(t => t.id === ticketId);
    if (!ticket || !ticket.linkedClickUp) return;

    const clickUp = MockData.clickUpIssues[clickUpKey];
    if (!clickUp) return;

    // Update ClickUp status
    clickUp.status = newStatus;
    clickUp.updated = new Date().toISOString();

    // Add timeline event
    MockData.timelines[ticketId].push({
      id: `msg-${Date.now()}`,
      type: 'system',
      channel: 'clickup',
      timestamp: new Date().toISOString(),
      content: `ClickUp ${clickUpKey} updated: Status changed to "${newStatus}"`,
      clickUpStatus: newStatus
    });

    // If resolved, change ticket status
    if (newStatus === 'Resolved' || newStatus === 'Closed') {
      ticket.status = 'open'; // Returns to agent queue
      Utils.showToast(`ClickUp ${clickUpKey} is ready - ticket returned to queue`, 'success');
    }

    // Refresh if viewing this ticket
    if (Conversation.currentTicket?.id === ticketId) {
      Conversation.loadTicket(ticketId);
    }
    Inbox.render();
  },

  /**
   * Simulate incoming Slack message
   */
  simulateSlackMessage(ticketId, channel, sender, content) {
    const ticket = MockData.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Add to timeline
    if (!MockData.timelines[ticketId]) {
      MockData.timelines[ticketId] = [];
    }

    MockData.timelines[ticketId].push({
      id: `msg-${Date.now()}`,
      type: 'message',
      channel: 'slack',
      sender: 'customer',
      senderName: sender,
      timestamp: new Date().toISOString(),
      content: content,
      isSlackThread: true
    });

    ticket.updatedAt = new Date().toISOString();
    if (!ticket.channels.includes('slack')) {
      ticket.channels.push('slack');
    }
    ticket.linkedSlack = true;

    Utils.showToast(`New Slack message from ${sender}`, 'info');

    // Refresh UI
    if (Conversation.currentTicket?.id === ticketId) {
      Conversation.loadTicket(ticketId);
    }
    Inbox.render();
  },

  /**
   * Demo helper - simulate events for demonstration
   */
  demo: {
    // Simulate ClickUp update
    clickUpUpdate() {
      const ticket = MockData.tickets.find(t => t.linkedClickUp);
      if (ticket) {
        App.simulateClickUpUpdate(ticket.id, ticket.linkedClickUp, 'Resolved');
      }
    },

    // Simulate Slack message
    slackMessage() {
      const ticket = MockData.tickets[0];
      App.simulateSlackMessage(
        ticket.id,
        '#techcorp-support',
        'Sarah Chen',
        'Quick update - we found a workaround for now, but still need the permanent fix!'
      );
    },

    // Convert current conversation to email
    chatToEmail() {
      if (Conversation.currentTicket) {
        MockData.timelines[Conversation.currentTicket.id].push({
          id: `msg-${Date.now()}`,
          type: 'system',
          channel: 'system',
          timestamp: new Date().toISOString(),
          content: 'Conversation converted from Chat to Email for async follow-up'
        });
        Conversation.loadTicket(Conversation.currentTicket.id);
        Utils.showToast('Conversation converted to email', 'success');
      }
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Expose for console debugging
window.App = App;

// Console help
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           HIVER OMNICHANNEL PROTOTYPE                         ║
╠═══════════════════════════════════════════════════════════════╣
║  Demo Commands (run in browser console):                      ║
║  ─────────────────────────────────────────                    ║
║  App.demo.clickUpUpdate() - Simulate ClickUp status update    ║
║  App.demo.slackMessage()  - Simulate incoming Slack message   ║
║  App.demo.chatToEmail()   - Convert current chat to email     ║
║                                                               ║
║  AI Features:                                                 ║
║  ─────────────────────────────────────────                    ║
║  Click the 🤖 button (bottom right) or select a ticket        ║
║  to see AI analysis including:                                ║
║  • Smart Reply Suggestions                                    ║
║  • Sentiment & Urgency Detection                              ║
║  • Auto-Triage (L0/L1/L2, priority, tags)                     ║
║  • Conversation Summary                                       ║
║  • Similar Tickets Finder                                     ║
║                                                               ║
║  Core Features:                                               ║
║  ─────────────────────────────────────────                    ║
║  • Unified omnichannel inbox (Email, Chat, Slack, Phone)      ║
║  • Chat-to-email conversion                                   ║
║  • Slack context capture (click Slack Thread)                 ║
║  • Visual L0/L1/L2 escalation                                 ║
║  • Bi-directional ClickUp integration                         ║
║  • KB article suggestions                                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
