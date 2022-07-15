import AppClass from './AppClass'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import React from 'react'

// Write your tests here
test('AppClass renders without errors', () => {
  render(<AppClass />)
})
