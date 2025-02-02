import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ControlOutlined, CopyOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import styled from 'styled-components';
import { RootState } from 'typesafe-actions';

import { updateConditionBindDrawerVisible } from '@/actions/builder/condition';
import * as ACTIONS from '@/actions/builder/template';
import GlobalContext from '@/pages/GlobalContext';

import { BLANK_NODE, SYSTEM_PAGE } from '../../../../constant';

const Boundary = styled.div`
  border: 2px solid #1890ff;
  position: absolute;
  right: 0;
  z-index: 1;
  pointer-events: none;
`;

const Button = styled.button`
  font-size: 12px;
  background: rgb(24, 144, 255);
  width: 26px;
  height: 20px;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 15px;
  border: none;
  border-radius: 0;
  padding: 0;
  outline: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    background: rgb(64, 169, 255);
  }
`;
const OperateTool = styled.div`
  position: absolute;
  right: 0;
  text-align: right;
  pointer-events: auto;
`;

const BUTTON_SIZE = 22; // height & width

const mapStateToProps = (store: RootState) => ({
  selectedComponent: store.builder.template.selectedComponent,
  versionChange: store.builder.template.versionChange,
});

const mapDispatchToProps = {
  deleteComponent: ACTIONS.deleteComponent,
  rollbackComponent: ACTIONS.rollbackComponent,
  copyComponent: ACTIONS.copyComponent,
  openConditionBind: () => updateConditionBindDrawerVisible(true),
};

type Type = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Tools: React.FC<Type> = (props) => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [rect, setRect] = useState<{ top: number; height: number; width: number }>({
    top: 0,
    height: 0,
    width: 0,
  });
  const {
    selectedComponent,
    versionChange,
    deleteComponent,
    rollbackComponent,
    copyComponent,
    openConditionBind,
  } = props;
  const { locale } = useContext(GlobalContext);
  const { global, builder } = locale.business;
  const isBlankNode = selectedComponent.name === BLANK_NODE;

  const getSelectedElement = (id: string) => {
    return document.getElementById(id || SYSTEM_PAGE);
  };

  useEffect(() => {
    const root = document.getElementById('root');
    if (root && selectedComponent) {
      // TODO: optimize
      setTimeout(() => {
        const scrollTop = root.getBoundingClientRect().top;
        updateRect(scrollTop);
      });
      root.addEventListener('scroll', () => {
        const scrollTop = root.getBoundingClientRect().top;
        updateRect(scrollTop);
      });
    } else {
      setRect({ top: 0, height: 0, width: 0 });
    }
  }, [selectedComponent, versionChange]);

  const updateRect = (scrollTop: number) => {
    if (!selectedComponent) {
      setRect({ top: 0, height: 0, width: 0 });
      return;
    }
    const element = getSelectedElement(selectedComponent.id);
    if (element) {
      const { top, width, height } = element.getBoundingClientRect();
      setRect({ top: top - scrollTop, width, height });
    }
  };

  if (!selectedComponent || !getSelectedElement(selectedComponent.id)) {
    return null;
  }

  const { top = 0, width = 0, height = 0 } = rect;

  return (
    <React.Fragment>
      <Boundary style={{ top, width: Math.max(width, 42), height }} />
      {selectedComponent.id && (
        <OperateTool style={{ top: top - BUTTON_SIZE < 0 ? top + height : top - BUTTON_SIZE }}>
          {!isBlankNode ? (
            <>
              <Button onClick={openConditionBind}>
                <ControlOutlined />
              </Button>
              <Popconfirm
                title={builder.componentCopyMsg}
                onConfirm={() => {
                  copyComponent(applicationId, selectedComponent.wrapper || selectedComponent.id);
                }}
                okText={global.yes}
                cancelText={global.no}>
                <Button>
                  <CopyOutlined />
                </Button>
              </Popconfirm>

              <Popconfirm
                title={builder.componentDeleteMsg}
                onConfirm={() => {
                  deleteComponent(applicationId, selectedComponent.wrapper || selectedComponent.id);
                }}
                okText={global.yes}
                cancelText={global.no}>
                <Button>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </>
          ) : (
            <>
              <Popconfirm
                title={builder.componentRollBackMsg}
                onConfirm={() => {
                  rollbackComponent(applicationId, selectedComponent.wrapper || selectedComponent.id);
                }}
                okText={global.yes}
                cancelText={global.no}>
                <Button>
                  <RollbackOutlined />
                </Button>
              </Popconfirm>
            </>
          )}
        </OperateTool>
      )}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);
