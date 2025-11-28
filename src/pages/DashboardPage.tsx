import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
export default function DashboardPage() {
  return ( <div>
      <Header />
      <Dashboard userEmail="teste@teste.com" />
    </div>)
}
