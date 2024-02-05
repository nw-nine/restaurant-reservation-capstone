import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import CreateReservation from "../reservations/CreateReservation";
import { today } from "../utils/date-time";
import CreateTables from "../tables/CreateTables";
import CreateSeats from "../seating/CreateSeats";
import MobileSearch from "../search/MobileSearch";
import Edit from "../reservations/Edit";



/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <CreateSeats />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route path="/tables/new">
        <CreateTables />
      </Route>
      <Route>
        <MobileSearch exact={true} path="/search"/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
