/**
 * Utility Functions for Hiver Omnichannel Prototype
 */

const Utils = {
  /**
   * Format a date string to relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format a date string to time (e.g., "2:30 PM")
   */
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format a date string to full date time
   */
  formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format a date string to just date (e.g., "Mar 14, 2026")
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

  /**
   * Format number with commas (e.g., 125000 → "125,000")
   */
  formatNumber(num) {
    return num.toLocaleString('en-US');
  },

  /**
   * Get channel icon
   */
  getChannelIcon(channel) {
    const icons = {
      email: '📧',
      chat: '💬',
      slack: '📱',
      phone: '📞',
      jira: '🔗',
      system: '⚙️'
    };
    return icons[channel] || '📩';
  },

  /**
   * Get channel display name
   */
  getChannelName(channel) {
    const names = {
      email: 'Email',
      chat: 'Chat',
      slack: 'Slack',
      phone: 'Phone',
      jira: 'Jira',
      system: 'System'
    };
    return names[channel] || channel;
  },

  /**
   * Get tier display name
   */
  getTierName(tier) {
    const names = {
      1: 'Tier 1',
      2: 'Tier 2',
      3: 'Tier 3'
    };
    return names[tier] || `Tier ${tier}`;
  },

  /**
   * Get tier description
   */
  getTierDescription(tier) {
    const descriptions = {
      1: 'Operational / Process',
      2: 'Technical Investigation',
      3: 'Management / Complex'
    };
    return descriptions[tier] || '';
  },

  /**
   * Get priority display
   */
  getPriorityDisplay(priority) {
    const displays = {
      high: { label: 'High', class: 'high' },
      medium: { label: 'Medium', class: 'medium' },
      low: { label: 'Low', class: 'low' }
    };
    return displays[priority] || { label: priority, class: '' };
  },

  /**
   * Get status display
   */
  getStatusDisplay(status) {
    const displays = {
      open: { label: 'Open', class: 'open' },
      pending: { label: 'Pending', class: 'pending' },
      waiting: { label: 'Waiting on Eng', class: 'waiting' },
      resolved: { label: 'Resolved', class: 'resolved' },
      closed: { label: 'Closed', class: 'closed' }
    };
    return displays[status] || { label: status, class: '' };
  },

  /**
   * Get customer tier display
   */
  getCustomerTierDisplay(tier) {
    const displays = {
      enterprise: { label: 'Enterprise', class: 'enterprise' },
      pro: { label: 'Pro', class: 'pro' },
      free: { label: 'Free', class: 'free' }
    };
    return displays[tier] || { label: tier, class: '' };
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Convert newlines to <br> tags
   */
  nl2br(text) {
    return Utils.escapeHtml(text).replace(/\n/g, '<br>');
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Simple DOM element creator
   */
  createElement(tag, className, innerHTML) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  },

  /**
   * Get initials from name
   */
  getInitials(name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  /**
   * Show a toast notification
   */
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span class="toast-message">${Utils.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Export for use in other modules
window.Utils = Utils;
