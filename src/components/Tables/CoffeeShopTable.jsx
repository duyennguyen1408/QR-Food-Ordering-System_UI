import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import CoffeeShopList from "../../pages/CoffeeShop/CoffeeShopList";
import CoffeeShopByManager from "../../pages/CoffeeShop/CoffeeShopByManager";

const CoffeeShopTable = () => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {currentUser.data.userRole === 5 ? (
                <CoffeeShopList />
            ) : currentUser.data.userRole === 4 ? (
                <CoffeeShopByManager
                    currentUserId={currentUser.data.id}
                    currentUserFullName={currentUser.data.fullName}
                />
            ) : (
                <p>You do not have access to view coffee shops.</p>
            )}
        </div>
    );
};

export default CoffeeShopTable;
