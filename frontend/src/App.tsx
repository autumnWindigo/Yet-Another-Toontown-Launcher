import React, { useEffect, useReducer, useState } from "react";
import LoginPage from "./modules/login/LoginPage.tsx";
import Calculator from "./modules/calculator/CalculatorPage.tsx";
import { AppShell } from "@mantine/core";
import {
  GetAllAccounts,
  Login,
} from "../bindings/YATL/services/loginservice.ts";
import { SidebarItems } from "./components/navbar/NavbarTypes.ts";
import MultiToonPage from "./modules/multiToon/MultiToonPage.tsx";
import Navbar from "./components/navbar/NavbarLink.tsx";
import YATLReducer, { YATLActionType, YATLState } from "./state.ts";
import { MTProfile, MTSession } from "./modules/multiToon/logic/MultiToonTypes.ts";
import { LoadAllMTProfiles, Mt_get_window_from_pid, Mt_init } from "../bindings/YATL/services/multiservice.ts";
import dreamlandTheme from "./themes/DreamlandTheme.ts";
import { initTTRKeys } from "./modules/multiToon/logic/multiUtils.ts";
import { Events } from "@wailsio/runtime";
import InputWindow from "./modules/multiToon/components/inputWindow.tsx";

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );

  const initialYatlState: YATLState = {
    MTProfiles: [],
    MTSessions: [],
    accounts: [],
    processIDs: {},
  };

  const [yatlState, yatlDispatch] = useReducer(YATLReducer, initialYatlState)


  useEffect(() => {
    const fetchAccounts = async () => {
      const allAccounts = await GetAllAccounts();
      yatlDispatch({ type: YATLActionType.SET_ACCOUNTS, accounts: allAccounts });

      const initialPIDs: Record<string, number> = {};
      allAccounts.forEach((acc) => {
        initialPIDs[acc] = -1;
        yatlDispatch({ type: YATLActionType.ADD_PID, username: acc, pid: -1, })
      });
    };

    const fetchKeyBinds = async () => {
      const rawProfiles = await LoadAllMTProfiles();

      for (const [name, profile] of Object.entries(rawProfiles)) {
        yatlDispatch({
          type: YATLActionType.ADD_MT_PROFILE,
          profile: {
            name,
            keyMap: profile.KeyMap || {},
            autoAttatchAccounts: profile.AutoAttatchAccounts || [],
          },
        });
      }
    };

    const fetchTTRBinds = async () => {
      await initTTRKeys();
    }

    fetchAccounts();
    fetchKeyBinds();
    fetchTTRBinds();
  }, []);

  useEffect(() => {
    const removePID = (event: { data: { pid: number } }) => {
      const pid = event.data?.[0]?.pid;
      if (pid == null) return;
      yatlDispatch({ type: YATLActionType.REMOVE_PID, pid });
    };

    Events.On("common:PID-killed", removePID);

    return () => {
      Events.Off("common:PID-killed");
    };
  }, []);

  const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

  const tryToAttatchUsers = async (pid: number, username: string) => {
    let newSession = await Mt_init();

    for (const profile of yatlState.MTProfiles) {
      if (profile.autoAttatchAccounts.includes(username)) {
        let retries = 0;
        let w = 0;

        while (w === 0 && retries < 20) {
          w = await Mt_get_window_from_pid(newSession, pid);

          if (w !== 0) {
            const session: MTSession = { mt_session: newSession, window: w, profile: profile, attatchedUser: username }
            yatlDispatch({ type: YATLActionType.ADD_MT_SESSION, session: session })
          }

          retries++;
          await delay(500);
        }
      }
    }
  };

  const handlePlay = async (username: string) => {
    await Login(username).then(async (pid) => {
      yatlDispatch({ type: YATLActionType.ADD_PID, pid: pid, username: username })
      await tryToAttatchUsers(pid, username);
    })
  };

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return (
          <LoginPage
            handlePlay={handlePlay}
            processIDs={yatlState.processIDs}
            accounts={yatlState.accounts}
          />
        );
      case SidebarItems.Calculator:
        return <Calculator />;
      case SidebarItems.MultiToon:
        return <MultiToonPage
          accounts={yatlState.accounts}
          MTSessions={yatlState.MTSessions}
          yatlProfiles={yatlState.MTProfiles}
          AddMTSession={(session: MTSession) => yatlDispatch({ type: YATLActionType.ADD_MT_SESSION, session: session })}
          AddMTProfile={(profile: MTProfile) => yatlDispatch({ type: YATLActionType.ADD_MT_PROFILE, profile: profile })}
          EditMTProfile={(profile: MTProfile) => yatlDispatch({ type: YATLActionType.EDIT_MT_PROFILE, profile: profile })}
        />;
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

  return (
    <AppShell
      padding="md"
      navbar={{
        width: { base: 80, md: 80, lg: 80 },
        breakpoint: "sm",
      }}
      style={{ background: dreamlandTheme.colors!.dark![8] }}
    >
      <Navbar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <AppShell.Main>
        {renderPage()}
      </AppShell.Main>
      <InputWindow yatlSessions={yatlState.MTSessions} />
    </AppShell>
  );
};

export default App;
