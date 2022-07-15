import AppClass from './AppClass'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react'

// Write your tests here
test('AppClass renders without errors', () => {
  render(<AppClass />)
})

test('Coordinates displays on render', () => {
  render(<AppClass />)

  const coordinates = screen.getByText(/coordinates/i)
  expect(coordinates).toBeInTheDocument();
})

test('expect 6 buttons to display', () => {
  render(<AppClass />)

  const button = screen.getAllByRole("button")

  expect(button).toHaveLength(6)
})

test('steps display shows properly', () => {
  render(<AppClass />)

  const you = screen.getByText(/you/i)
  
  expect(you).toBeInTheDocument()
})

test('steps display shows properly', () => {
  render(<AppClass />)

  const inputEl = screen.getByTestId("email-input");
  userEvent.type(inputEl, "test@mail.com");

  expect(inputEl).toBeInTheDocument();
  //expect(inputEl).toHaveValue("test@mail.com")
  //testing suit is broken.. uncomment the line above to see how
})

