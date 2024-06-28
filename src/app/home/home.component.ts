import { Component,OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { LoginService } from '../services/login.service';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  exchangeRate: number = 1;
  prato:any;
  pratos:any;
  visible:boolean=false;
  suggestedQuantity: number = 5;
  visible_tipos:boolean = false;
  formTipos: FormGroup;
  visible_pratos: boolean=false;
  formPratos:FormGroup;
  listaTipos: any[] = [];
  selectedTipos: any;
  selectedPrato: number=0;
  formCompra: FormGroup;
  selectedCategorias: any[] = [];


  constructor(private homeService: HomeService,private loginService: LoginService, private fb: FormBuilder, private router: Router)
  {
    this.formTipos = this.fb.group({
    descricao: ['', Validators.required]
  });
  this.formPratos = this.fb.group({
    descprod: ['', Validators.required],
    qtd: ['', Validators.required],
    valor: ['', Validators.required],
    categoria: ['', Validators.required]

  });
  this.formCompra = this.fb.group({
    quantidade: ['', Validators.required]

  })



}

ngOnInit(){
  this.loadExchangeRate();
  this.loadPrato();
  this.loadTipos();
}
loadExchangeRate() {
  this.homeService.getExchangeRate().subscribe(
  (rate: number) => {
  this.exchangeRate = rate;
},
  error => {
  console.error('Erro ao carregar taxa de câmbio', error);
        }
      );
    }
    convertToUSD(valor: number): number {
      return valor * this.exchangeRate;
    }
    loadPrato() {
      this.homeService.getPrato().subscribe(
        (data: any) => {
          this.pratos = data;

        },
        error => {
          console.error('Erro ao carregar pratos', error);
        }
      );
    }

    items = [
      {
        label: 'Novos Tipos',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          this.novosTipos();
        }
      },
      {
        label: 'Cadastro de Produtos',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          this.cadastroPratos();
        }
      }
    ]
    ;
  novosTipos(){
    console.log("Adicionado a categoria");
    this.visible_tipos=true;
  }
  criarTipos() {
    if (this.formTipos && this.formTipos.valid) {
      const descricaoControl = this.formTipos.get('descricao');
      if (descricaoControl) {
        const descricao = descricaoControl.value;
        this.homeService.postTipos({ descricao: descricao }).subscribe(
          (response) => {
            console.log('Categoria criada com sucesso', response);
            this.visible_tipos = false; // Feche o diálogo após a criação
            this.loadPrato(); // Recarregue os produtos
          },
          (error) => {
            console.error('Falha ao criar categoria', error);
            if (error.status === 400) {
              console.error('Erro 400: Descrição da categoria inválida');
            } else {
              console.error('Erro desconhecido:', error);
            }
          }
        );
      } else {
        console.error('Controle de descrição não encontrado');
      }
    } else {
      console.error('Formulário de categoria inválido');
    }
  }
  cadastroPratos(){
    console.log("Prato adicionado");
    this.visible_pratos=true;
  }
  criarPratos(){
    if (this.formPratos.valid && this.selectedTipos) {
      const formData = this.formPratos.value;
      const pratoData = {
        nomeclatura: formData.descprod,
        qtd: formData.qtd,
        valor: formData.valor,
        tipoid: formData.categoria[0]['id'],
        idlogin: localStorage.getItem('idusuario'),
        imagem: "xxxx"  // Verifique se isso está sendo passado corretamente
      };

      this.homeService.postPratos(pratoData).subscribe(
        (response) => {
          console.log('Produto criado com sucesso', response);
          this.visible_pratos = false;
          this.loadPrato();
        },
        (error) => {
          console.error('Erro ao criar produto', error);
        }
      );
    } else {
      console.error('Formulário inválido ou nenhuma categoria selecionada');
      console.log('Formulário:', this.formPratos.value);
      console.log('Categoria selecionada:', this.selectedTipos);
    }




  }
  loadTipos() {
    this.homeService.getTipos().subscribe(
      (data: any) => {
        // Verifique se os dados são realmente um array e mapeie para o formato esperado
        if (Array.isArray(data)) {
          this.listaTipos = data.map(item => ({ descricao: item.descricao_prato, id: item.idtipo }));
          console.log("Tipos:", this.listaTipos);
        } else {
          console.error('Os dados retornados não são um array:', data);
        }
      },
      error => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  showDialog(id:number){
    this.visible=true;
    this.selectedPrato=id;
    this.formCompra.reset();




  }
  getStatus(prato: any): { color: string, label: string } {
    if (prato.qtd_prato < this.suggestedQuantity) {
      return { color: 'red', label: 'Ultimas unidades' };
    } else if (prato.qtd_prato <= 5) {
      return { color: 'yellow', label: 'Abaixo do ideal' };
    } else {
      return { color: 'green', label: 'Excelente' };
    }
  }
  compra(){
    if (this.formCompra && this.formCompra.valid) {
      const quantidadeControl = this.formCompra.get('quantidade');
      if (quantidadeControl) {
        const quantidade = quantidadeControl.value;
        this.homeService.postCompra(this.selectedPrato, { quantidade }).subscribe(
          (response) => {
            console.log('Produto comprado com sucesso', response);
            this.visible = false; // Feche o diálogo após a compra
            this.loadPrato(); // Recarregue os produtos
          },
          (error) => {
            console.error('Falha na compra', error);  // Trata o erro aqui
            if (error.status === 400) {
              console.error('Erro 400: Quantidade desejada não disponível');
            } else if (error.status === 404) {
              console.error('Erro 404: Produto não encontrado');
            } else {
              console.error('Erro desconhecido:', error);
            }
          }
        );
      } else {
        console.error('Controle de quantidade não encontrado');
      }
    } else {
      console.error('Formulário inválido');
    }




  }






}

