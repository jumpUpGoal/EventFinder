import StatusLabel, { Status } from './components/status-label';
import AddCompanyButton from './components/add-company-button';
import ServerComponent from './components/server-component';
import ClientComponent from './components/client-component';
import ServerComponentCopy from './components/server-component-copy';

export default function Home() {
  return (
    <main>
      <h1 className="text-xl">Home page</h1>
      <StatusLabel status={Status.Active}>Active</StatusLabel>
      <StatusLabel status={Status.NotActive}>NotActive</StatusLabel>
      <StatusLabel status={Status.Pending}>Pending</StatusLabel>
      <StatusLabel status={Status.Suspended}>Suspended</StatusLabel>
      <AddCompanyButton />
      <ServerComponent />
      <ClientComponent>
        <ServerComponentCopy />
      </ClientComponent>
    </main>
  );
}