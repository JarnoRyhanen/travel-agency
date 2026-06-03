import { Header } from '../../../components';
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from '@syncfusion/ej2-react-grids';
import { getAllUsers } from '~/appwrite/auth';
import type { Route } from './+types/all-users';
import { normalizeUser } from '~/lib/utils';
import { handleAllUsersCellInfo } from '~/lib/all-users-grid';

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);

  return {
    users: users.map((user, index) =>
      normalizeUser(user as Record<string, unknown>, index)
    ),
    total,
  };
};

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user profiles"
      />

      <GridComponent
        dataSource={users}
        gridLines="None"
        queryCellInfo={handleAllUsersCellInfo}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="email"
            headerText="Email Address"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="dateJoined"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default AllUsers;
