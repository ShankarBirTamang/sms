// Icon.tsx
import {icons} from "./icons.tsx";

// Define prop types for the Icon component
interface IconProps {
    name: string;          // Name of the icon
    className?: string;    // Optional class names
}

// const Icon: React.FC<IconProps> = ({name, className = ""}) => {
//     // Look up the icon by name, fallback to "default" if not found
//     // const IconSvg = icons[name] || icons["default"];
//     //
//     // return <span className={`svg-icon ${className}`}>{IconSvg}</span>;
// };

// export default Icon;

const Icon = ({name, className = ""}: IconProps) => {
    const IconSvg = icons[name] || icons["default"];
    
    return <span className={`svg-icon ${className}`}>{IconSvg}</span>;
};

export default Icon;