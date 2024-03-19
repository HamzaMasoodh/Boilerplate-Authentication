export function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/;
    return regex.test(password);
  }
  
  export const validatePasswordChar = (passwordValue) => {
    return (
      validatePassword(passwordValue) ||
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  };
  
  export function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  
  export function checkStatus(item) {
    if (!'isArchived' in item && !'isLead' in item) return 'All';
    else if (item.isArchived === true) return 'Archive';
    else if (item.isLead === true) return 'Lead';
    else if (item.isLead === false && item.isArchived == false) return 'Active';
  }
  
  export function formatDateTimeDay(isoDateString) {
    const date = new Date(isoDateString);
  
    // Format: "Day, Time, Date"
    // Example: "Thursday, 1:02 AM, 28 Dec"
    return date.toLocaleString('en-US', {
      // weekday: "long",
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short'
    });
  }
  
  export function formatYearDateTimeDay(isoDateString) {
    const date = new Date(isoDateString);
  
    // Get year, month, and date components
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
  
    // Construct the date string as "Year, Month Date"
    // Example: "2020, Dec 28"
    return `${year}, ${month} ${day}`;
  }
  
  
  
  export function addUniqueIds(dataArray) {
    let fid = 0;
    return dataArray.map((item) => ({
      ...item,
      id: fid++
    }));
  }
  
  export function fixQueryString(query) {
    return query.replace(/&+/g, '&');
  }
  
  const filterMappings = {
    name: { typeKey: 'nameFilterType', valueKey: 'nameFilterValue' },
    address: { typeKey: 'addressFilterType', valueKey: 'addressFilterValue' },
    company: { typeKey: 'companyFilterType', valueKey: 'companyFilterValue' },
    email: { typeKey: 'emailFilterType', valueKey: 'emailFilterValue' },
    phone: { typeKey: 'phoneFilterType', valueKey: 'phoneFilterValue' }
  };
  
  export function getFilteredDataValues(d) {
    let newTag = {};
    if (d?.limit) newTag['limit'] = [d?.limit];
    if (d?.status) newTag['filter'] = [d?.status];
    if (d?.searchTerm) newTag['searchTerm'] = [d?.searchTerm];
    if (d?.tags?.include?.length > 0) newTag['includeTags'] = d?.tags?.include || [];
    if (d?.tags?.exclude?.length > 0) newTag['excludeTags'] = d?.tags?.exclude || [];
    if (d?.filters.length > 0) {
      d?.filters?.forEach((f) => {
        const mapping = filterMappings[f?.label];
        if (mapping) {
          newTag[mapping.typeKey] = [f?.constraint] || [''];
          newTag[mapping.valueKey] = [f?.value] || [''];
        }
      });
    }
    return newTag;
  }
  
  export const formatNumber = (number) => {
    if (Number.isInteger(number)) {
      return number?.toString();
    } else {
      // If not an integer, format to two decimal places
      return number?.toFixed(2);
    }
  };
  
  export const getCompleteAddress = (address) => {
    let array = [];
    if (address?.street1) array.push(address.street1);
    if (address?.street2) array.push(address.street2);
    if (address?.city) array.push(address.city);
    if (address?.province) array.push(address.province);
    if (address?.country) array.push(address.country);
    if (address?.postalCode) array.push(address.postalCode);
    return array.join(', ');
  };
  
  export function formatNumberWithSpaces(x) {
    // Convert the number to a string
    if(x){
  
      let parts = x?.toString()?.split('.');
      
      // Replace every three digits from the end to the start of the string with the digits followed by a space
      parts[0] = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      
      // Rejoin integer and decimal parts
      return parts?.join('.');
    }
  }
  