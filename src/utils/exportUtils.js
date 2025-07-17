export function exportToCSV(data, columns, filename = 'export') {
  if (!data.length) return
    
  // Create CSV content
  let csvContent = columns.join(',') + '\n'
    
  data.forEach(item => {
    const row = columns.map(col => {
      let value = item[col.key] || ''
        
      // Escape double quotes
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`
      }
        
      return value
    })
      
    csvContent += row.join(',') + '\n'
  })
    
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
    
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
    
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
