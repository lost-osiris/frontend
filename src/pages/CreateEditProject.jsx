import React, { useState } from 'react'
import * as api from '~/api'
import TinyMce from '../components/TinyMce'

import {
  TextField,
  FormControlLabel,
  Switch,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

const filter = createFilterOptions()

export const CreateEditProject = ({ props }) => {
  const [value, setValue] = useState(null)
  let categories = []

  let defaultState = {
    categories: categories || [],
    description: '',
    is_public: false,
    summary: location.state?.summary || '',
    type: location.state?.type || 'bug',
    version: '',
  }

  const [project, setProject] = useState(defaultState)
  const [isPublic, setIsPublic] = useState(false)

  let create = false
  let edit = false

  const handleCategories = (e) => {
    if (e.key === 'Enter') {
      console.log('enter pressed')
      console.log(e.value)
    }
    console.log(e)
  }

  if (window.location.href.indexOf('create') > -1) {
    create = true
  } else if (window.location.href.indexOf('edit') > -1) {
    edit = true
  }

  const updateProject = (field, value) => {
    if (field === 'is_public') {
      setProject({
        ...project,
        is_public: isPublic,
      })
    }
  }

  const handleFormSubmit = () => {
    console.log(project)
  }

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={isPublic}
            onChange={() => {
              setIsPublic(!isPublic)
              updateProject('is_public', isPublic)
            }}
          />
        }
        label='Publicize Project'
      />
      <TextField
        id='standard-basic'
        label='Project Name'
        onChange={(e) => updateProject('summary', e.target.value)}
        value={project.summary}
        variant='standard'
      />
      <TinyMce
        height={300}
        onChange={(e) => updateProject('description', e.target.value)}
        value={project.description}
      />
      <Autocomplete
        clearOnBlur
        filterOptions={(options, params) => {
          const filtered = filter(options, params)

          const { inputValue } = params
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.title,
          )
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            })
          }

          return filtered
        }}
        freeSolo
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue
          }
          // Regular option
          return option.title
        }}
        handleHomeEndKeys
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({
              title: newValue,
            })
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
              title: newValue.inputValue,
            })
          } else {
            setValue(newValue)
          }
        }}
        options={categories}
        renderInput={(params) => (
          <TextField {...params} label='Add categories' />
        )}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        selectOnFocus
        sx={{ width: 300 }}
        value={value}
      />

      <List>
        {categories.map((el) => {
          return (
            <ListItem
              key={el}
              secondaryAction={
                <IconButton aria-label='delete' edge='end'>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={el} />
            </ListItem>
          )
        })}
      </List>
      {create && (
        <Button
          endIcon={<SendIcon />}
          onClick={handleFormSubmit}
          variant='contained'
        >
          Create Project
        </Button>
      )}
      {edit && (
        <Button
          endIcon={<SendIcon />}
          onClick={handleFormSubmit}
          variant='contained'
        >
          Update Project
        </Button>
      )}
    </div>
  )
}
