import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent, AgentExecutionTrace, AgentMonitoringStats } from '@/types';

interface AgentState {
  agents: Agent[];
  activeTrace: AgentExecutionTrace | null;
  stats: AgentMonitoringStats | null;
  isOrchestrating: boolean;
}

const initialState: AgentState = {
  agents: [],
  activeTrace: null,
  stats: null,
  isOrchestrating: false,
};

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    setActiveTrace: (state, action: PayloadAction<AgentExecutionTrace | null>) => {
      state.activeTrace = action.payload;
    },
    setStats: (state, action: PayloadAction<AgentMonitoringStats | null>) => {
      state.stats = action.payload;
    },
    setIsOrchestrating: (state, action: PayloadAction<boolean>) => {
      state.isOrchestrating = action.payload;
    },
  },
});

export const { setAgents, setActiveTrace, setStats, setIsOrchestrating } = agentSlice.actions;
export default agentSlice.reducer;
