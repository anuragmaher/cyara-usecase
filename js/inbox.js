/**
 * Inbox Module for Hiver Omnichannel Prototype
 * Handles ticket list rendering and filtering
 */

const Inbox = {
  currentFilter: 'all',
  searchQuery: '',
  selectedTicketId: null,

  /**
   * Initialize the inbox module
   */
  init() {
    this.bindEvents();
    this.render();
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Search input
    const searchInput = document.getElementById('inbox-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
      }, 300));
    }
  },

  /**
   * Set the active filter
   */
  setFilter(filter) {
    this.currentFilter = filter;

    // Update UI
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    this.render();
  },

  /**
   * Get filtered tickets
   */
  getFilteredTickets() {
    let tickets = MockData.tickets;

    // Apply channel filter
    if (this.currentFilter !== 'all') {
      tickets = tickets.filter(t => t.channel === this.currentFilter);
    }

    // Apply search filter
    if (this.searchQuery) {
      tickets = tickets.filter(t => {
        const customer = MockData.customers[t.customerId];
        const searchableText = [
          t.subject,
          t.preview,
          t.id,
          customer?.name,
          customer?.company,
          ...t.tags
        ].join(' ').toLowerCase();

        return searchableText.includes(this.searchQuery);
      });
    }

    // Sort by updated date (newest first)
    tickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return tickets;
  },

  /**
   * Render the inbox list
   */
  render() {
    const inboxList = document.getElementById('inbox-list');
    if (!inboxList) return;

    const tickets = this.getFilteredTickets();

    if (tickets.length === 0) {
      inboxList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <h4>No tickets found</h4>
          <p>Try adjusting your filters or search query</p>
        </div>
      `;
      return;
    }

    inboxList.innerHTML = tickets.map(ticket => this.renderTicketItem(ticket)).join('');

    // Bind click events
    inboxList.querySelectorAll('.ticket-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectTicket(item.dataset.ticketId);
      });
    });

    // Update inbox count badge
    const unreadCount = MockData.tickets.filter(t => t.unread).length;
    const countBadge = document.getElementById('inbox-count');
    if (countBadge) {
      countBadge.textContent = unreadCount;
      countBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  },

  /**
   * Render a single ticket item
   */
  renderTicketItem(ticket) {
    const customer = MockData.customers[ticket.customerId];
    const priority = Utils.getPriorityDisplay(ticket.priority);
    const isActive = this.selectedTicketId === ticket.id;

    // Build tags HTML
    let tagsHtml = '';
    if (ticket.linkedJira) {
      tagsHtml += `<span class="ticket-tag jira">Jira</span>`;
    }
    if (ticket.linkedSlack) {
      tagsHtml += `<span class="ticket-tag slack">Slack</span>`;
    }

    return `
      <div class="ticket-item ${isActive ? 'active' : ''} ${ticket.unread ? 'unread' : ''}"
           data-ticket-id="${ticket.id}">
        <div class="ticket-header">
          <span class="ticket-channel ${ticket.channel}">${Utils.getChannelIcon(ticket.channel)}</span>
          <span class="ticket-customer">${Utils.escapeHtml(customer?.name || 'Unknown')}</span>
          <span class="ticket-time">${Utils.formatRelativeTime(ticket.updatedAt)}</span>
        </div>
        <div class="ticket-subject">${Utils.escapeHtml(ticket.subject)}</div>
        <div class="ticket-preview">${Utils.escapeHtml(ticket.preview)}</div>
        <div class="ticket-meta">
          <span class="ticket-tier tier-${ticket.tier}">Tier ${ticket.tier}</span>
          <span class="ticket-priority ${priority.class}">${priority.label}</span>
          <div class="ticket-tags">${tagsHtml}</div>
        </div>
      </div>
    `;
  },

  /**
   * Select a ticket
   */
  selectTicket(ticketId) {
    this.selectedTicketId = ticketId;

    // Update inbox UI
    document.querySelectorAll('.ticket-item').forEach(item => {
      item.classList.toggle('active', item.dataset.ticketId === ticketId);
    });

    // Mark as read
    const ticket = MockData.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.unread = false;
    }

    // Notify other modules
    if (window.Conversation) {
      Conversation.loadTicket(ticketId);
    }

    this.render(); // Re-render to update unread state
  },

  /**
   * Get selected ticket
   */
  getSelectedTicket() {
    return MockData.tickets.find(t => t.id === this.selectedTicketId);
  }
};

// Export for use in other modules
window.Inbox = Inbox;
