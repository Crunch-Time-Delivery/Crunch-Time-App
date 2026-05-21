import { fetchPayments, applyFilters, clearFilters, exportPaymentsToCSV } from './payment.js';

function setupEventListeners() {
  document.getElementById('filterBtn').addEventListener('click', () => fetchPayments({ page: 1, filters: currentFilters }));
  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('filterMethod').value = 'All';
    document.getElementById('filterStatus').value = 'All';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    currentFilters = {};
    fetchPayments({ page: 1, filters: {} });
  });
  document.getElementById('exportBtn').addEventListener('click', exportPaymentsToCSV);
}

export { setupEventListeners };