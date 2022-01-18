import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestComponent} from './test.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import SpyObj = jasmine.SpyObj;
import {of} from "rxjs";


describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  // Módulo que cria a funcionalidade de usar mock data em teste HTTP
  let httpClientSpy: SpyObj<HttpClient>;

  // beforeEach vai ser executando antes de cada teste
  // Criando um modulo de teste que será executado de forma assíncrona.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [HttpClientModule] // preciso importar para que o componente Test consiga executar seu construtor.
    })
      .compileComponents(); // Peço para compilar os componentes. Será criado um tipo de DOM virtual.

  });

  // beforeEach vai ser executado antes de cada teste.
  beforeEach(() => {
    // Criando um objeto mock Spy de HttpClient para testes.
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    // Criando um componente manualmente aplicando o Spy como parâmetro
    component = new TestComponent(httpClientSpy);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it("The value is valueAfterSynchrone !", () => expect((component).synchroneValue()).toBe('valueAfterSynchrone'));

  // Testando um método assíncrono
  it('should retrieve service name', () => {
    let serviceName: string = '';
    // No then, eu recupero o valor de return de valueAfterA e guardo o valor em uma promise (_service).
    // Após, mudo o valor da variável serviceName com o valor recuperado da promise.
    return component.valueAfterA().then(
      _service => {
        serviceName = _service;
        expect(serviceName).toBe('valueAfterAsynchrone');
      }
    );
  });

  // Testando um método assíncrono 2
  it("should change value in async function", () => {
    // Quando eu faço o then, eu reenvio uma promise.
    // Para evitar que a função termine o teste antes de finalizar a execução da função assíncrona,
    // podemos apenas fazer um return e ele vai esperar que a promise termine de ser executada para finalizar o teste.
    return component.valueAfterA().then(() => {
      expect(component._value).toBe('valueAfterAsynchrone');
    })
  });

  // Testando método HTTP de forma assíncrona
  it("should change value after http call", () => {
    // Crio uma fake query http do tipo get e retorno um objeto observável com um valor.
    // O método of() serve para converter um objeto em um observável que envia um objeto.
    httpClientSpy.get.and.returnValue(of("This http works!"));
    // Verifico se o resultado da variável value é igual à string indicada na expectation,
    // bem como igual ao resultado obtido na query http.
    return component.changeValueWithHttpClient().then( () => {
      expect(component._value).toBe('This http works!');
    });
  });

});
