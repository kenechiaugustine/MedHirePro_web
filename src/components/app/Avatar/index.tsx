interface AvatarProps {
    name?: string | null;
    avatarUrl?: string | null;
    size?: 'sm' | 'md' | 'lg';
    role?: 'professional' | 'institute' | 'admin';
}

const Avatar = ({ name, avatarUrl, size = 'md', role = 'professional' }: AvatarProps) => {
    const getInitials = (fullName: string | null | undefined) => {
        if (!fullName) return '?';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-20 h-20 text-xl font-bold',
    };

    const bgColors = {
        professional: 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white',
        institute: 'bg-gradient-to-tr from-purple-600 to-indigo-400 text-white',
        admin: 'bg-gradient-to-tr from-teal-600 to-emerald-400 text-white',
    };

    const initials = getInitials(name);

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name || 'User Avatar'}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
                onError={(e) => {
                    // Fail-safe if image fails to load: clear it to fallback to initials
                    e.currentTarget.style.display = 'none';
                }}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} ${bgColors[role]} rounded-full flex items-center justify-center font-semibold shadow-md border-2 border-white tracking-wider`}>
            {initials}
        </div>
    );
};

export default Avatar;
