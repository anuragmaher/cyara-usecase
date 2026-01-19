/**
 * Escalation Module for Hiver Omnichannel Prototype
 * Handles L0/L1/L2 escalation workflow
 */

const Escalation = {
  /**
   * Initialize the escalation module
   */
  init() {
    // Initialization if needed
  },

  /**
   * Show escalation modal
   */
  showEscalationModal(ticket) {
    if (!ticket) {
      Utils.showToast('No ticket selected', 'error');
      return;
    }

    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    const currentTier = ticket.tier;

    modalTitle.textContent = 'Escalate Ticket';

    // Build escalation options based on current tier
    let optionsHtml = '';

    if (currentTier < 1) {
      optionsHtml += `
        <div class="escalation-option" data-tier="1">
          <div class="escalation-option-icon tier-1">🔧</div>
          <div class="escalation-option-info">
            <h5>L1 - Technical Support</h5>
            <p>For technical issues requiring deeper analysis and troubleshooting.</p>
          </div>
        </div>
      `;
    }

    if (currentTier < 2) {
      optionsHtml += `
        <div class="escalation-option" data-tier="2">
          <div class="escalation-option-icon tier-2">👨‍💻</div>
          <div class="escalation-option-info">
            <h5>L2 - Engineering</h5>
            <p>For complex issues requiring engineering team involvement and code-level investigation.</p>
          </div>
        </div>
      `;
    }

    optionsHtml += `
      <div class="escalation-option" data-tier="engineering">
        <div class="escalation-option-icon engineering">📋</div>
        <div class="escalation-option-info">
          <h5>L3 Engineering (Create ClickUp)</h5>
          <p>Create a ClickUp task for engineering team. Ticket will be in "Waiting" status until resolved.</p>
        </div>
      </div>
    `;

    modalBody.innerHTML = `
      <p style="margin-bottom: 16px; color: var(--gray-600);">
        Current: <strong>L${currentTier}</strong> (${Utils.getTierDescription(currentTier)})
      </p>
      <div class="escalation-options">
        ${optionsHtml}
      </div>
      <div class="form-group" style="margin-top: 16px;">
        <label class="form-label">Escalation Notes (Required)</label>
        <textarea class="form-textarea" id="escalation-notes"
                  placeholder="Describe why this ticket needs escalation and any relevant context..."></textarea>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="modal-confirm" disabled>Escalate</button>
    `;

    modal.style.display = 'flex';

    // Track selected option
    let selectedTier = null;

    // Bind option selection
    modalBody.querySelectorAll('.escalation-option').forEach(option => {
      option.addEventListener('click', () => {
        modalBody.querySelectorAll('.escalation-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedTier = option.dataset.tier;
        document.getElementById('modal-confirm').disabled = false;
      });
    });

    // Bind events
    document.getElementById('modal-cancel').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-close').onclick = () => modal.style.display = 'none';
    document.getElementById('modal-confirm').onclick = () => {
      const notes = document.getElementById('escalation-notes').value.trim();

      if (!notes) {
        Utils.showToast('Please add escalation notes', 'warning');
        return;
      }

      if (!selectedTier) {
        Utils.showToast('Please select an escalation target', 'warning');
        return;
      }

      // Handle escalation
      if (selectedTier === 'engineering') {
        modal.style.display = 'none';
        // Add escalation note to timeline first
        this.addEscalationNote(ticket, 'engineering', notes);
        // Then show ClickUp modal
        Conversation.showClickUpModal();
      } else {
        this.escalateToTier(ticket, parseInt(selectedTier), notes);
        modal.style.display = 'none';
      }
    };
  },

  /**
   * Escalate ticket to a specific tier (L0/L1/L2)
   */
  escalateToTier(ticket, tier, notes) {
    const previousTier = ticket.tier;
    ticket.tier = tier;
    ticket.updatedAt = new Date().toISOString();

    // Add escalation note to timeline
    this.addEscalationNote(ticket, tier, notes);

    // Add system message
    if (!MockData.timelines[ticket.id]) {
      MockData.timelines[ticket.id] = [];
    }
    MockData.timelines[ticket.id].push({
      id: `msg-${Date.now()}`,
      type: 'system',
      channel: 'system',
      timestamp: new Date().toISOString(),
      content: `Ticket escalated from L${previousTier} to L${tier} (${Utils.getTierDescription(tier)})`
    });

    // Refresh UI
    Conversation.loadTicket(ticket.id);
    Inbox.render();

    Utils.showToast(`Escalated to L${tier}`, 'success');
  },

  /**
   * Add escalation note to timeline
   */
  addEscalationNote(ticket, tier, notes) {
    if (!MockData.timelines[ticket.id]) {
      MockData.timelines[ticket.id] = [];
    }

    const tierLabel = tier === 'engineering' ? 'L3 Engineering' : `L${tier}`;

    MockData.timelines[ticket.id].push({
      id: `msg-${Date.now()}`,
      type: 'message',
      channel: 'email',
      sender: 'agent',
      senderName: 'Harsha G',
      timestamp: new Date().toISOString(),
      content: `[Escalation to ${tierLabel}]\n\n${notes}`,
      isInternal: true
    });
  },

  /**
   * Show quick escalation button (drag-and-drop style)
   */
  renderQuickEscalation(containerId, ticket) {
    const container = document.getElementById(containerId);
    if (!container || !ticket) return;

    const currentTier = ticket.tier;
    const tiers = [
      { tier: 0, label: 'L0', desc: 'First Response' },
      { tier: 1, label: 'L1', desc: 'Technical' },
      { tier: 2, label: 'L2', desc: 'Engineering' }
    ];

    container.innerHTML = `
      <div class="quick-escalation">
        <span class="quick-escalation-label">Quick Escalate:</span>
        <div class="quick-escalation-tiers">
          ${tiers.map(t => `
            <button class="quick-tier-btn ${t.tier === currentTier ? 'active' : ''} ${t.tier < currentTier ? 'completed' : ''}"
                    data-tier="${t.tier}"
                    ${t.tier <= currentTier ? 'disabled' : ''}>
              ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Bind click events
    container.querySelectorAll('.quick-tier-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.dataset.tier);
        this.showQuickEscalationConfirm(ticket, tier);
      });
    });
  },

  /**
   * Show quick escalation confirmation
   */
  showQuickEscalationConfirm(ticket, tier) {
    const notes = prompt(`Escalating to L${tier}. Please provide a brief reason:`);
    if (notes && notes.trim()) {
      this.escalateToTier(ticket, tier, notes.trim());
    }
  }
};

// Export for use in other modules
window.Escalation = Escalation;
