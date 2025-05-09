# System Prompt Manager

The System Prompt Manager is a comprehensive UI for creating, editing, and managing system prompts for AI applications. It provides a versioning system to track changes and allows for comparison between different versions of prompts.

## Features

- **Prompt Management**: Create, edit, and delete system prompts
- **Categorization**: Organize prompts with customizable categories
- **Version History**: Track changes to prompts over time
- **Version Comparison**: Compare different versions using a diff viewer
- **Restore Previous Versions**: Easily revert to earlier versions of prompts

## Components

- `SystemPromptManager`: Main component that orchestrates the UI and state
- `PromptEditor`: Handles editing of individual prompts with version tracking
- `PromptVersionHistory`: Displays version history with comparison features
- `DiffViewer`: Shows differences between prompt versions

## Data Structure

The System Prompt Manager works with three main data types:

- `SystemPrompt`: Represents a system prompt with its metadata and content
- `SystemPromptVersion`: Represents a specific version of a system prompt
- `SystemPromptCategory`: Represents a category for organizing prompts

## Future Enhancements

- Integration with actual backend storage
- User roles and permissions for prompt management
- Deployment capabilities to use prompts in production
- Import/export functionality for prompts
- Template library for common prompt patterns

## Implementation Notes

This module is currently implemented with mock data for development and demonstration purposes. In a production environment, the action functions would connect to a real backend API or database to persist changes.

The diff viewer component uses `react-diff-viewer-continued` for visualizing differences between prompt versions. 