class StationHierarchy {
  constructor() {
    this.data = {
      UP: { name: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur Nagar', 'Varanasi', 'Agra', 'Prayagraj', 'Gorakhpur'] },
      MH: { name: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'] },
      BR: { name: 'Bihar', districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Purnia', 'Darbhanga'] },
      RJ: { name: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'] },
      MP: { name: 'Madhya Pradesh', districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Rewa'] },
      GJ: { name: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
      WB: { name: 'West Bengal', districts: ['Kolkata', 'Howrah', 'Darjeeling', 'Asansol', 'Durgapur', 'Siliguri'] },
      TN: { name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore'] },
      KA: { name: 'Karnataka', districts: ['Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Belagavi', 'Hubballi', 'Ballari'] },
      KL: { name: 'Kerala', districts: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'] },
      TG: { name: 'Telangana', districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Adilabad'] },
      AP: { name: 'Andhra Pradesh', districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore'] },
      PB: { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'] },
      HR: { name: 'Haryana', districts: ['Gurugram', 'Faridabad', 'Hisar', 'Karnal', 'Panipat', 'Ambala'] },
      JH: { name: 'Jharkhand', districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'] },
      OD: { name: 'Odisha', districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore'] }
    };
  }

  getStates() {
    return Object.entries(this.data).map(([code, value]) => ({ code, name: value.name }));
  }

  getDistricts(stateCode) {
    return (this.data[stateCode] && this.data[stateCode].districts || []).map((name) => ({
      name,
      code: name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, 'X')
    }));
  }

  generateStationId(stateCode, districtCode, uniqueNumber) {
    const seq = String(uniqueNumber || Math.floor(Math.random() * 9000 + 1000)).padStart(4, '0');
    return `${stateCode}-${districtCode}-${seq}`;
  }

  populateStateDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Select State</option>';
    this.getStates().forEach((state) => {
      const option = document.createElement('option');
      option.value = state.code;
      option.textContent = `${state.name} (${state.code})`;
      select.appendChild(option);
    });
  }

  populateDistrictDropdown(stateCode, selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Select District</option>';
    this.getDistricts(stateCode).forEach((district) => {
      const option = document.createElement('option');
      option.value = district.code;
      option.textContent = district.name;
      select.appendChild(option);
    });
  }

  bindStateDistrict(stateSelectId, districtSelectId) {
    this.populateStateDropdown(stateSelectId);
    const stateSelect = document.getElementById(stateSelectId);
    if (!stateSelect) return;
    stateSelect.addEventListener('change', (event) => this.populateDistrictDropdown(event.target.value, districtSelectId));
  }
}

window.stationHierarchy = new StationHierarchy();
