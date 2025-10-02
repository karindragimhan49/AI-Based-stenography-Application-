const PasswordStrengthMeter = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#059669'];

    return {
      score,
      label: labels[score - 1] || '',
      color: colors[score - 1] || '#ef4444'
    };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: password ? `${(strength.score / 4) * 100}%` : '0%',
            backgroundColor: strength.color 
          }}
        />
      </div>
      {password && (
        <p 
          className="text-sm mt-1 transition-all duration-300"
          style={{ color: strength.color }}
        >
          {strength.label}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;