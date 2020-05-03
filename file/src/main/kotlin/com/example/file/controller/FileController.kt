package com.example.file.controller

import com.example.file.model.File
import com.example.file.repository.FileRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*
import javax.validation.Valid

@RestController
@RequestMapping("/files")
class FileController(private val fileRepository: FileRepository) {
  @GetMapping()
  fun getFileList(): List<File> = fileRepository.findAll()

  @PostMapping()
  fun createFile(@Valid @RequestBody file: File):  File = fileRepository.save(file)

  @GetMapping("/{id}")
  fun getFileById(@PathVariable(value = "id") fileId: Long): ResponseEntity<File> {
    return fileRepository.findById(fileId).map{ file -> ResponseEntity.ok(file)}.orElse(ResponseEntity.notFound().build())
  }
}
