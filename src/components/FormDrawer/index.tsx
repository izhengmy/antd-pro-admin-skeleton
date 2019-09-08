import { Button, Drawer, Form, message } from 'antd';
import React, { CSSProperties, Component, ComponentType, ReactElement } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { okResponse } from '@/utils/utils';

interface Config {
  title: string;
  width?: CSSProperties['width'];
  okText?: string;
  cancelText?: string;
  submitSuccessText?: string;
  validateFailsText?: string;
}

interface Record {
  [propName: string]: any;
}

export interface FormDrawerProps extends FormComponentProps {
  id?: number | string;
  record: Record;
  control: ReactElement;
  handleSubmit(record: Record, id?: number | string): Promise<any>;
  successfulCallback?(): Promise<any>;
}

interface FormDrawerState {
  visible: boolean;
  submitting: boolean;
}

export interface WrappedComponentProps extends FormComponentProps {
  id?: FormDrawerProps['id'];
  record: Record;
}

const create = (config: Config) => <P extends WrappedComponentProps>(WrappedComponent: ComponentType<P>) => {
  const { title } = config;
  const width = config.width || '500px';
  const okText = config.okText || '提交';
  const cancelText = config.cancelText || '关闭';
  const submitSuccessText = config.submitSuccessText || '操作成功';
  const validateFailsText = config.validateFailsText || '请检查您的表单信息是否符合规则';
  class FormDrawer extends Component<FormDrawerProps, FormDrawerState> {
    state: FormDrawerState = {
      visible: false,
      submitting: false,
    };

    componentWillUnmount() {
      this.setState = () => {};
    }

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };

    hideDrawer = () => {
      this.setState({
        visible: false,
      });
    };

    handleSubmit = () => {
      const { form, id, handleSubmit, successfulCallback } = this.props;
      form.validateFields(async (error, values) => {
        if (error) {
          message.warning(validateFailsText);
          return;
        }
        this.setState({
          submitting: true,
        });
        const response = await handleSubmit(values, id);
        this.setState({
          submitting: false,
        });
        if (okResponse(response)) {
          message.success(submitSuccessText);
          this.hideDrawer();
          if (successfulCallback) {
            successfulCallback();
          }
        }
      });
    };

    handleCancel = () => {
      this.hideDrawer();
    };

    render() {
      const { control } = this.props;
      const { visible, submitting } = this.state;
      const props: WrappedComponentProps = {
        form: this.props.form,
        id: this.props.id,
        record: this.props.record,
      };
      return (
        <>
          {React.cloneElement(control, { onClick: this.showDrawer })}
          {visible ? (
            <Drawer destroyOnClose title={title} visible={visible} width={width} onClose={this.handleCancel}>
              <div style={{ marginBottom: 50 }}>
                <WrappedComponent {...(props as P)} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 9,
                }}
              >
                <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
                  {cancelText}
                </Button>
                <Button onClick={this.handleSubmit} type="primary" loading={submitting}>
                  {okText}
                </Button>
              </div>
            </Drawer>
          ) : null}
        </>
      );
    }
  }
  return Form.create<FormDrawerProps>()(FormDrawer);
};

export default {
  create,
};
