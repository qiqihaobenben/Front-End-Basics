#!/usr/bash

file_page=5

file_number=2

count() {
  echo $((${file_page} * file_number))
}
