import styled from "styled-components";

//Most of the styles are copied from the button for testing purposes
export const StyledColorGridButton = styled.button`
  font-size: 12px;
  min-height: calc(var(--root-unit) * 10);
  min-width: calc(var(--root-unit) * 27);
  cursor: pointer;
  border-radius: var(--border-radius-1);
  outline: 0;

  &[data-variant="primary"] {
    background-color: var(--color-bg-accent);
    color: var(--color-fg-on-accent);
    border-color: transparent;

    &[data-hovered],
    &:hover {
      background-color: var(--color-bg-accent-hover);
    }

    &[data-active],
    &:active {
      background-color: var(--color-bg-accent-active);
    }
  }

  &[data-variant="secondary"] {
    background-color: transparent;
    color: var(--color-fg-accent);
    border-color: var(--color-bd-accent);
    border-width: var(--border-width-1);

    &[data-hovered],
    &:hover {
      background-color: var(--color-bg-accent-subtle-hover);
    }

    &[data-active],
    &:active {
      background-color: var(--color-bg-accent-subtle-active);
    }
  }

  &[data-variant="tertiary"] {
    background: transparent;
    color: var(--color-fg-accent);
    border-color: transparent;
    border-width: 0;

    &[data-hovered],
    &:hover {
      background: var(--color-bg-accent-subtle-hover);
    }

    &[data-active],
    &:active {
      background: var(--color-bg-accent-subtle-active);
    }
  }

  &[data-focused],
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-bd-focus);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: var(--opacity-disabled);
  }
`;
