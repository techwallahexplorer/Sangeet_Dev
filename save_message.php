<?php

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Define Excel file name
    $file = 'messages.xlsx';

    // Retrieve form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Create or open Excel file
    $excel = new COM("Excel.Application") or die("Error: Unable to create Excel object");
    $workbook = $excel->Workbooks->Open($file);
    $sheet = $workbook->Worksheets('Sheet1');

    // Find the next available row
    $row = $sheet->Range("A" . $sheet->Rows->Count)->End[-4162]->Row + 1;

    // Write data to Excel
    $sheet->Cells($row, 1)->Value = $name;
    $sheet->Cells($row, 2)->Value = $email;
    $sheet->Cells($row, 3)->Value = $subject;
    $sheet->Cells($row, 4)->Value = $message;

    // Save and close Excel file
    $workbook->_Save();
    $workbook->Close(false);
    $excel->Quit();
    $excel = null;
}
?>
