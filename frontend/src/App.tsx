import React, { useEffect, useState } from "react";
import LoginPage from "./pages/login/Login";
import Calculator from "./pages/calculator/CalculatorPage.tsx";
import { AppShell, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import {
  GetAllAccounts,
  Login,
} from "../bindings/YATL/services/loginservice.ts";
import { NavbarData, NavbarLinkProps, SidebarItems } from "./NavbarTypes.ts";
import classes from "./navbar.module.css"

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );
  const [processIDs, setProcessIDs] = useState<Record<string, number>>({});
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const allAccounts = await GetAllAccounts();
      setAccounts(allAccounts);

      const initialPIDs: Record<string, number> = {};
      allAccounts.forEach((acc) => {
        initialPIDs[acc] = -1;
      });
      setProcessIDs(initialPIDs);
    };
    fetchAccounts();
  }, []);


  function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    );
  }

  // TODO: Add PID heartbeaT
  const handlePlay = async (username: string) => {
    // returns PID
    const pid = await Login(username);
    setProcessIDs((prev) => ({
      ...prev,
      [username]: pid,
    }));
  };

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return (
          <LoginPage
            handlePlay={handlePlay}
            processIDs={processIDs}
            accounts={accounts}
          />
        );
      case SidebarItems.Calculator:
        return <Calculator />;
      case SidebarItems.MultiToon:
        return <ComingSoonPage title="MultiToon Page" />;
      case SidebarItems.Suits:
        return <ComingSoonPage title="Cog Suits" />;
      case SidebarItems.Fishing:
        return <ComingSoonPage title="Fishing Page" />;
      case SidebarItems.ResourcePks:
        return <ComingSoonPage title="Resource Packs" />;
      case SidebarItems.Settings:
        return <ComingSoonPage title="Settings" />;
      default:
        return <div>Unknown Page</div>;
    }
  };

    const links = NavbarData.map((link) => (
      <NavbarLink
        {...link}
        key={link.label}
        active={link.page === selectedPage}
        onClick={() => { setSelectedPage(link.page) }}
      />
    ));

    return (
      <div style={{}}>
        <AppShell
          padding="md"
          navbar={{
            width: { base: 80, md: 80, lg: 80 },
            breakpoint: "sm",
          }}
        >
          <AppShell.Navbar p="md" style={{}}>
              <Stack justify="center" gap={2}>
                {links}
              </Stack>
          </AppShell.Navbar>
          <AppShell.Main>
            {renderPage()}
          </AppShell.Main>
        </AppShell>
      </div>
    );
  };

  export default App;
