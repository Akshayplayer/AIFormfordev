import { Component, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../server.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NotificationUtilService } from '../Notificaiton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private Myservice:ServerService,private route:ActivatedRoute, private router:Router, private notifier:NotificationUtilService){}
  empId!: number;
  empdetails:any;
  ngOnInit(){
    this.Myservice.selectedEmployeeId$.subscribe(empId => {
    if (empId) {
      this.empId = empId;
      this.Myservice.GetEmployee(this.empId).subscribe((data:any)=>{
        this.empdetails=data;
      })
    }
  });
  }
  goBack(): void {
    this.notifier.showMessage("Back to Home")
    this.router.navigate(['/Home']);
  }
  Update(empId: number) {
    this.notifier.showMessage("Edit the Data")
    this.router.navigate([`/Add/${empId}`])
  }

  downloadPDF() {
  const content = this.pdfContent.nativeElement;

  // Add pdf-mode class to body
  document.body.classList.add('pdf-mode');

  html2canvas(content).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('employee-details.pdf');

    // Remove pdf-mode after capture
    document.body.classList.remove('pdf-mode');
  });
}

}
