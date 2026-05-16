import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div>
            <h1>User Layout</h1>
            <Outlet />
        </div>
    );
}