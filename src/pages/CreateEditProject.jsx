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

  const [isPublic, setIsPublic] = useState(false)
  const [modlogsButtonColor, setModlogsButtonColor] = useState('primary')
  const [modlogsButtonText, setModlogsButtonText] = useState('Upload Modlogs')

  let defaultState = {
    banner_img: '',
    categories: categories || [],
    description: '',
    is_public: false,
    // summary: location.state?.summary || '',
    version: '',
  }

  const [project, setProject] = useState(defaultState)

  // console.log(project.banner_img)

  let create = false
  let edit = false

  const handleCategories = (e) => {
    if (e.key === 'Enter') {
      // console.log('enter pressed')
      // console.log(e.value)
    }
    // console.log(e)
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
    if (field === 'modlogs') {
      const reader = new FileReader()
      reader.readAsBinaryString(value)
      reader.onload = () => {
        // console.log(reader.result.split(',')[1])
        setProject({
          ...project,
          banner_img: value,
        })
      }
      reader.onerror = () => {
        console.log('file error', reader.error) //eslint-disable-line
      }
    }
  }

  const handleFormSubmit = () => {
    api.requests('post', '/api/project/testblob', { data: project })
    // .then((data) => console.log(data))
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
      <Button color={modlogsButtonColor} component='label' variant='contained'>
        {modlogsButtonText}
        <input
          accept='text/*'
          hidden
          onChange={(e) => {
            const file = e.target.files[0]
            if (file && file.size > 10 * 1024 * 1024) {
              setModlogsButtonColor('error')
              setModlogsButtonText('File size too large! ( > 10MB )')
              setTimeout(() => {
                setModlogsButtonColor('primary')
                setModlogsButtonText('Upload Modlogs')
              }, 5000)
            } else {
              updateProject('modlogs', file)
            }
          }}
          type='file'
        />
      </Button>
    </div>
  )
}
