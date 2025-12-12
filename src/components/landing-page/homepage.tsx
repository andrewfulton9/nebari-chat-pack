import type {
  ReactNode
} from 'react';

import {
  useState
} from "react";

import {
  useConfig
} from '@/components/common';

import {
  ChevronDown
} from 'lucide-react';

import {
  Explore
} from './explore'

import {
  DropdownArea
} from './dropdownarea'

/*
 * Renders the Home page component
 * This page just shows the genaral config for the backend
 * This includes general links mirrored from the sidebar
 * And a list of all available aggents, teams and workflows that are available
**/
export
function HomePage(): ReactNode {

  const config = useConfig();

  const [isAgentsExpanded, setIsAgentsExpanded] = useState(true);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(true);
  const [isWorkflowsExpanded, setIsWorkflowsExpanded] = useState(true);

  return (
    <main className='flex flex-col w-full gap-4'>
      <div className="text-xl font-bold p-6">Welcome</div>

      <div className="px-6">
          <div className="text-md font-semibold mb-4">Explore</div>
          <Explore/>
      </div>

      <div className="px-6">
        <button
          onClick={() => setIsAgentsExpanded((isAgentsExpanded) => !isAgentsExpanded)}
          className='flex flex-row'
        >
          <div className="text-md font-semibold mb-4">Agents</div>
          <ChevronDown className={`transition-transform ${isAgentsExpanded ? "" : "rotate-180"}`}/>
        </button>
        <DropdownArea 
          isExpanded={isAgentsExpanded}
          content={config.agents}
          type='agent'
        />
      </div>

      <div className="px-6">
        <button
          onClick={() => setIsTeamsExpanded((isTeamsExpanded) => !isTeamsExpanded)}
          className='flex flex-row'
        >
          <div className="text-md font-semibold mb-4">Teams</div>
          <ChevronDown className={`transition-transform ${isTeamsExpanded ? "" : "rotate-180"}`}/>
        </button>
        <DropdownArea
          isExpanded={isTeamsExpanded}
          content={config.teams}
          type='team'
        />
      </div>

      <div className="px-6">
        <button
          onClick={() => setIsWorkflowsExpanded((isWorkflowsExpanded) => !isWorkflowsExpanded)}
          className='flex flex-row'
        >
          <div className="text-md font-semibold mb-4">Workflows</div>
          <ChevronDown className={`transition-transform ${isWorkflowsExpanded ? "" : "rotate-180"}`}/>
        </button>
        <DropdownArea isExpanded={isWorkflowsExpanded} content={config.workflows} type='workflow'/>
      </div>
    </main>
  )
}
