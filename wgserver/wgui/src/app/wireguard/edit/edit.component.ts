import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { QW } from 'src/app/_lib/qw.helper';
import { WGService } from 'src/app/_lib/WGService';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute } from '@angular/router';

type Modem = {
  modemPK: string
  cName: string
  passw: string
  ipaddr: string
}

@Component({
  selector: 'app-edit',
  standalone: true,
  // changeDetection:ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MySharedModules],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  sitil: string = "'background-color': 'red'";
  modemPK: any;
  public editItem: Modem = { cName: '', modemPK: '', passw: '', ipaddr: '' };
  isButtonVisible!: boolean;
  winconf: any;
  hide!: boolean;
  modem_script: any;
  selectedTabIndex: any;
  constructor(private wgService: WGService, private route: ActivatedRoute, private clipboard: Clipboard) {

  }



  async ngOnInit() {
    const modemPK = this.route.snapshot.paramMap.get('modemPK') ?? "-1";
    if (modemPK == "-1") { this.isButtonVisible = false }
    else this.isButtonVisible = true;
    const fd = new FormData();
    fd.append("modemPK", modemPK);
    const json = await QW.json("/svcWg/getModem", fd)
    if (json.data != false)
      this.editItem = json.data;
    this.readScriptText('modem');


  }
  public async submitForm(action: any = null): Promise<void> {


    this.wgService.formdata = this.editItem;
    if (action == 'delete' && !confirm('Silmek istediğinizden emin misiniz'))
      return;

    let data = await this.wgService.save(action, this.editItem);
    if (data.li > 0) QW.showSnack("Başarılı", "succes")
    else QW.showSnack("Hata", "error")

  }
  Randpassw() {
    this.editItem.passw = this.makeid(29);
  }
  async Randip() {
    let data = await this.wgService.getNewIp()
    this.editItem.ipaddr = data.FirstAvailableIP;
  }
  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  async onTabChanged($event: any) {
    if (this.selectedTabIndex == 2 && !this.winconf) {
      let data = await this.wgService.wgWinConf(this.editItem.cName, this.editItem.passw, 'windows');
      this.winconf = data;
    }
    else if (this.selectedTabIndex == 0) {
      this.readScriptText("modem");
    }
    else this.readScriptText('linux');
  }

  async readScriptText(path: string) {
    this.modem_script = await QW.asset(`/assets/${path}_script.sh`);
    this.modem_script = this.modem_script.replace("{{cName}}", this.editItem.cName);
    this.modem_script = this.modem_script.replace("{{passw}}", this.editItem.passw);

  }

  copyClipboad(text: string) {
    this.clipboard.copy(text);
    QW.showSnack("Kopyalandı", "succes")

  }

}



