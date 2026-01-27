/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
        ToolCallMessagePartProps
} from '@assistant-ui/react';

import type {
        ReactNode
} from 'react';

import {
        ToolFallback
} from '@/components/assistant-ui/tool-fallback';

import {
        EChartRenderer
} from './echartrenderer';

import {
        HITLRenderer
} from './hitlrenderer';

import {
        ScheduleRenderer
} from './schedulerenderer';


/**
 * A react component that renders all tool calls for AUI threads.
 *
 * This component is used as the "override" tool call renderer for
 * assistant-ui and handles the dispatch for all tool calls in the
 * app. If it detects a known mime type that we can handle, it will
 * dispatch to that renderer. Otherwise, it will fallback to the
 * default tool renderer provided by assisant-ui.
 *
 * By using this component as the override, it provides a simpler entry
 * point for customizing tool rendering vs the AUI hook/component approach,
 * which requires the app to know the explicit tool names ahead of time.
 *
 * TODO add support for MCP-UI tool results.
 */
export
        function ToolRenderer(props: ToolCallMessagePartProps): ReactNode {
        // Try to cast the result to a known mime result.
        const mimeResult = Private.castResult(props.result);

        // If the cast failed, fallback to the default AUI tool renderer.
        if (!mimeResult) {
                // Fallback: If the tool name matches our scheduler, try to force render.
                // This handles cases where the MIME type might be stripped or obscured.
                if (props.toolName === 'generate_draft_schedule') {
                        let data: any = props.result;
                        console.log('DEBUG: Schedule Tool Result:', data); // Log the result
                        if (typeof data === 'string') {
                                try {
                                        // Attempt to fix Python string representation to JSON
                                        // 1. Replace single quotes with double quotes
                                        // 2. Replace None with null
                                        // 3. Replace True/False with true/false
                                        const fixedData = data
                                                .replace(/'/g, '"')
                                                .replace(/None/g, 'null')
                                                .replace(/True/g, 'true')
                                                .replace(/False/g, 'false');
                                        data = JSON.parse(fixedData);
                                } catch (e) {
                                        console.error('Failed to parse schedule data:', e);
                                }
                        }

                        // Check if we have the inner data structure (data.data or just data)
                        // The backend returns { mimeType: ..., data: { ... } }
                        // But sometimes the LLM might strip the outer shell.

                        if (data && typeof data === 'object') {
                                // Case 1: Wrapped correctly but MIME type check failed?
                                if ('data' in data && 'assignments' in data.data) {
                                        return <ScheduleRenderer result={
                                                {
                                                        mimeType: 'application/vnd.openteams-schedule',
                                                                data: data.data
                                                }
                                        } />;
                                }
                                // Case 2: Direct data object (no outer wrapper)?
                                if ('assignments' in data && 'metadata' in data) {
                                        return <ScheduleRenderer result={
                                                {
                                                        mimeType: 'application/vnd.openteams-schedule',
                                                                data: data as any
                                                }
                                        } />;
                                }
                        }
                }

                return <ToolFallback { ...props } />;
        }

        // Dispatch to the known renderer.
        switch (mimeResult.mimeType) {
                case 'application/vnd.openteams-echart':
                        return <EChartRenderer result={ mimeResult } />;
                case 'application/vnd.openteams-agno-hitl':
                        return <HITLRenderer result={ mimeResult } />;
                case 'application/vnd.openteams-schedule':
                        return <ScheduleRenderer result={ mimeResult } />;
                default:
                        throw 'unreachable';
        }
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
        /**
         * A type alias for the known mime results.
         */
        export
                type MimeResult = (
                        EChartRenderer.MimeResult |
                        HITLRenderer.MimeResult |
                        ScheduleRenderer.MimeResult
                );

        /**
         * A function that will safely cast an unknown tool result to a mime result.
         *
         * If the cast cannot be made, this will return `null`.
         */
        export
                function castResult(result: unknown): MimeResult | null {
                // Bail if the result is empty.
                if (!result) {
                        return null;
                }

                // Try to parse the string as JSON if it is a string.
                if (typeof result === 'string') {
                        try {
                                result = JSON.parse(result);
                        } catch {
                                return null;
                        }
                }

                // Bail if the result is empty.
                if (!result) {
                        return null;
                }

                // Bail if the result is not an object.
                if (typeof result !== 'object') {
                        return null;
                }

                // Bail if the result does not have a mime type.
                if (!('mimeType' in result)) {
                        return null;
                }

                // Bail if the mime type is not a string.
                if (typeof result.mimeType !== 'string') {
                        return null;
                }

                // Bail if the result does not have data.
                if (!('data' in result)) {
                        return null;
                }

                // Dispatch on the mime type.
                switch (result.mimeType) {
                        case 'application/vnd.openteams-echart':
                        case 'application/vnd.openteams-agno-hitl':
                        case 'application/vnd.openteams-schedule':
                                return { mimeType: result.mimeType, data: result.data as any };
                        default:
                                return null;
                }
        }
}
