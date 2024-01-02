import React, { useState } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material'

export const AutoComplete = ({ setter, options, label }) => {
  return (
    <Autocomplete
      autoHighlight
      getOptionLabel={(option) => option.username}
      id='country-select-demo'
      onChange={(event, newValue) => setter(newValue)}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          label={label}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { flexShrink: 0, mr: 2 } }}
          {...props}
        >
          <img
            alt={option.username}
            loading='lazy'
            src={`https://cdn.discordapp.com/avatars/${option.discord_id}/${option.avatar}.png`}
            style={{ borderRadius: '50%' }}
            width='40'
          />
          {option.username}
        </Box>
      )}
      sx={{ width: 300 }}
    />
  )
}
