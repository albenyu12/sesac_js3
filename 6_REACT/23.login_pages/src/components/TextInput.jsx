export default function TextInput({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange,
    inputRef = null 
}) {
    return (
        <label style={{ display: 'grid', gap: 6 }}>
            <span>{label}</span>
            <input 
                type={type} 
                value={value} 
                onChange={(e) => onChange(name, e.target.value)} 
                ref={inputRef}
            />
        </label>
    )
}