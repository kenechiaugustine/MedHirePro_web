import { Outlet } from "react-router-dom";

export default function ClientLayout() {
    return (
        <div>
            <h1>Client Layout</h1>
            <Outlet />
        </div>
    );
}