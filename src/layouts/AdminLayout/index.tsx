import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div>
            <h1>Admin layout</h1>
            <Outlet />
        </div>
    );
}
