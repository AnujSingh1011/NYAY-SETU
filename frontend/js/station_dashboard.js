class StationDashboard {
  constructor() {
    this.mock = {
      officers: [
        { id: 'OFF-201', name: 'Inspector Kavya', cases: 8, status: 'Available' },
        { id: 'OFF-202', name: 'SI Dev', cases: 11, status: 'On Field' },
        { id: 'OFF-203', name: 'HC Rohan', cases: 5, status: 'Available' }
      ],
      firs: [
        { id: 'FIR-2026-0101', title: 'Burglary', status: 'Investigation', assignedTo: 'OFF-201' },
        { id: 'FIR-2026-0102', title: 'Assault', status: 'Pending Assignment', assignedTo: '' }
      ],
      complaints: [
        { id: 'CMP-9031', text: 'Delay in FIR update', status: 'Open' },
        { id: 'CMP-9032', text: 'Officer response issue', status: 'In Review' }
      ]
    };
  }

  renderList(id, items, template) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(template).join('');
  }

  initialize() {
    this.renderList('stationOfficerList', this.mock.officers, (o) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>${o.name}</strong><br><small>${o.id}</small></span>
        <span class="badge bg-primary rounded-pill">${o.cases} cases</span>
      </li>`);

    this.renderList('stationFirList', this.mock.firs, (f) => `
      <li class="list-group-item">
        <div class="d-flex justify-content-between"><strong>${f.id}</strong><span class="badge bg-info">${f.status}</span></div>
        <small>${f.title} ${f.assignedTo ? `• Assigned: ${f.assignedTo}` : ''}</small>
      </li>`);

    this.renderList('stationComplaintList', this.mock.complaints, (c) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${c.id} - ${c.text}</span>
        <span class="badge bg-warning text-dark">${c.status}</span>
      </li>`);

    document.getElementById('assignCaseBtn')?.addEventListener('click', () => {
      const firId = document.getElementById('assignFirId')?.value;
      const officerId = document.getElementById('assignOfficerId')?.value;
      if (!firId || !officerId) {
        UIUtils.toast('Please choose FIR and officer.', 'warning');
        return;
      }
      const fir = this.mock.firs.find((x) => x.id === firId);
      if (fir) {
        fir.assignedTo = officerId;
        fir.status = 'Assigned';
      }
      this.initialize();
      UIUtils.toast('Case assigned successfully.');
    });
  }
}

window.stationDashboard = new StationDashboard();
