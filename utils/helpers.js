export const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    // Check if salary is already formatted
    if (typeof salary === 'string') return salary;
    
    // Format number to currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', options);
  };
  
  export const limitText = (text, limit = 100) => {
    if (!text || text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };