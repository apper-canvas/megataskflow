import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  className = ''
}) => {
  const handleDateChange = (e) => {
    onChange(e.target.value);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Calendar" size={16} className="text-surface-400" />
      </div>
      
      <input
        type="date"
        value={value}
        onChange={handleDateChange}
        disabled={disabled}
        className={`w-full pl-10 pr-4 py-2 border border-surface-300 rounded-button bg-white text-surface-900 placeholder-surface-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
          disabled ? 'opacity-50 cursor-not-allowed bg-surface-50' : ''
        }`}
      />
      
      {/* Display formatted date for better UX */}
      {value && (
        <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
          <span className="text-surface-900 text-sm">
            {formatDisplayDate(value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default DatePicker;